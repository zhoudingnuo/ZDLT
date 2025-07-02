import os
import requests
import json

# 配置区
API_KEY = "你的API KEY"
USER = "rongjie"
DIFY_SERVER = "http://192.168.1.10"  # 你的Dify服务器地址
DIR_PATH = r"F:\07-Dify\work\report"  # 需要批量处理的目录
TEXT = "课文内容"  # 默写批改的课文内容，可根据实际需求修改
MODE = "开启"  # 默写批改模式，可选"开启"或"关闭"

# 1. 上传本地图片，返回Dify文件id
def upload_file(local_file_path, api_key):
    file_type = 'application/octet-stream'  # 可根据实际类型调整
    url = f'{DIFY_SERVER}/v1/files/upload'
    headers = {'Authorization': f'Bearer {api_key}'}
    with open(local_file_path, 'rb') as file:
        files = {'file': (os.path.basename(local_file_path), file, file_type)}
        data = {'user': USER}
        try:
            response = requests.post(url, headers=headers, files=files, data=data)
        except Exception as e:
            print(f"[上传异常] {local_file_path}，错误: {str(e)}")
            return None
    if response.status_code == 201:
        print(f"[上传成功] {local_file_path}")
        return response.json()['id']
    else:
        print(f"[上传失败] {local_file_path}，状态码: {response.status_code}")
        return None

# 2. 用文件id调用默写批改API
def run_dictation_correction(file_id, user, api_key, text, mode="开启"):
    api_url = f"{DIFY_SERVER}/v1/chat-messages"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    data = {
        "inputs": {
            "im": { "id": file_id },
            "text": text,
            "mode": mode
        },
        "user": user,
        "query": "默写批改"
    }
    try:
        response = requests.post(api_url, headers=headers, json=data)
        if response.status_code == 200:
            print(f"[默写批改成功] 文件ID: {file_id}")
            return response.json(), True
        else:
            print(f"[默写批改失败] 文件ID: {file_id}，状态码: {response.status_code}")
            return {"status": "error", "message": f"Failed, status code: {response.status_code}"}, False
    except Exception as e:
        print(f"[默写批改异常] 文件ID: {file_id}，错误: {str(e)}")
        return {"status": "error", "message": str(e)}, False

# 3. 批量上传
def batch_upload_files(dir_path):
    file_id_map = {}  # 文件名 -> 文件ID
    failed_uploads = []
    for filename in os.listdir(dir_path):
        file_path = os.path.join(dir_path, filename)
        if os.path.isfile(file_path):
            print(f"\n上传文件: {file_path}")
            file_id = upload_file(file_path, API_KEY)
            if file_id:
                file_id_map[filename] = file_id
            else:
                failed_uploads.append(filename)
    return file_id_map, failed_uploads

# 4. 批量调用默写批改
def batch_run_dictation(file_id_map, text, mode="开启"):
    failed = []
    for filename, file_id in file_id_map.items():
        result, success = run_dictation_correction(file_id, USER, API_KEY, text, mode)
        print(f"结果: {json.dumps(result, ensure_ascii=False)}")
        if not success:
            failed.append(filename)
    return failed

if __name__ == "__main__":
    # 1. 批量上传
    file_id_map, failed_uploads = batch_upload_files(DIR_PATH)
    # 2. 批量调用默写批改
    failed_dictation = batch_run_dictation(file_id_map, TEXT, MODE)
    # 3. 输出失败信息
    if failed_uploads:
        print("\n以下文件上传失败：")
        for f in failed_uploads:
            print(f"- {f}")
    if failed_dictation:
        print("\n以下文件默写批改失败：")
        for f in failed_dictation:
            print(f"- {f}")
    if not failed_uploads and not failed_dictation:
        print("\n所有文件均处理成功！") 