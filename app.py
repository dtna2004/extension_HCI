import os
import sys
import asyncio
import logging
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import google.generativeai as genai
import edge_tts

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Fix for Windows asyncio issue with aiodns
if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

app = Flask(__name__)
CORS(app)

# Cấu hình Gemini
GEMINI_API_KEY = "AIzaSyCz5xpz4vnK-k1sLOaG5Xhqloc4UPiEoDg"
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.5-flash-lite')

@app.route('/summarize', methods=['POST'])
def summarize():
    logger.debug(f"Received request: {request}")
    logger.debug(f"Request headers: {request.headers}")
    logger.debug(f"Request data: {request.data}")
    
    data = request.json
    logger.debug(f"Parsed JSON data: {data}")
    
    text = data.get('text', '')
    logger.debug(f"Extracted text: {text}")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    try:
        # Tùy chọn ngôn ngữ tóm tắt
        language = data.get('language', 'vi')
        logger.debug(f"Language: {language}")
        
        prompt = f"Tóm tắt văn bản sau bằng tiếng {language} một cách ngắn gọn và súc tích: {text}" if language == 'vi' else f"Summarize this text concisely in {language}: {text}"
        logger.debug(f"Prompt: {prompt}")
        
        response = model.generate_content(prompt)
        logger.debug(f"Response: {response.text}")
        
        return jsonify({
            "summary": response.text,
            "original_text": text
        })
    except Exception as e:
        logger.error(f"Error in summarize: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/tts', methods=['POST'])
async def tts():
    data = request.json
    text = data.get('text', '')
    voice = data.get('voice', 'vi-VN-HoaiMyNeural') # Mặc định tiếng Việt
    rate = data.get('rate', '+0%')  # Tốc độ đọc
    volume = data.get('volume', '+0%')  # Âm lượng
    
    # Tạo thư mục output nếu chưa tồn tại
    if not os.path.exists('output'):
        os.makedirs('output')
        
    output_path = "output/output.mp3"
    communicate = edge_tts.Communicate(text, voice, rate=rate, volume=volume)
    await communicate.save(output_path)
    
    return send_file(output_path, mimetype="audio/mpeg", as_attachment=True, download_name="speech.mp3")

# Chạy async cho TTS trong Flask
@app.route('/speak', methods=['POST'])
def speak():
    return asyncio.run(tts())

# Endpoint để lấy danh sách voices hỗ trợ
@app.route('/voices', methods=['GET'])
def get_voices():
    # Danh sách voices phổ biến
    voices = [
        {"name": "vi-VN-HoaiMyNeural", "locale": "vi-VN", "gender": "Female", "description": "Tiếng Việt nữ"},
        {"name": "vi-VN-NamMinhNeural", "locale": "vi-VN", "gender": "Male", "description": "Tiếng Việt nam"},
        {"name": "en-US-JennyNeural", "locale": "en-US", "gender": "Female", "description": "English (US) female"},
        {"name": "en-US-GuyNeural", "locale": "en-US", "gender": "Male", "description": "English (US) male"},
        {"name": "fr-FR-DeniseNeural", "locale": "fr-FR", "gender": "Female", "description": "Français femme"},
        {"name": "es-ES-ElviraNeural", "locale": "es-ES", "gender": "Female", "description": "Español mujer"}
    ]
    return jsonify(voices)

if __name__ == '__main__':
    app.run(port=5000, debug=True)