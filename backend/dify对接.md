  {
    "id": "chinese-dictation",
    "name": "语文课文默写批改",
    "description": "语文课文默写内容智能批改，支持图片上传和参数配置",
    "apiUrl": "http://118.145.74.50:24131/v1/chat-messages",
    "apiKey": "app-eBrZ5PhyjyEH1lc1U0eNySMN",
    "workflow": true,
    "inputs": [
      {
        "name": "image",
        "label": "学生默写课文",
        "type": "file",
        "required": true,
        "description": "学生默写课文的图片文件，本地上传，上传之后须包含url链接"
      },
      {
        "name": "text",
        "label": "课文",
        "type": "string",
        "required": true,
        "description": "学生默写课文的题目"
      },
      {
        "name": "mode",
        "label": "批改模式",
        "type": "select",
        "required": true,
        "options": [
          {
            "value": "开启",
            "label": "开启"
          },
          {
            "value": "关闭",
            "label": "关闭"
          }
        ],
        "description": "批改模式选择"
      }
    ],
    "inputType": "parameter",
    "status": "configured"
  },在后端文件的agents.json里面，保存有调用每个智能体所需要的所有参数，存在inputs字段中，参数下的type决定了改参数是否需要经过dify的upload接口，文件、上传文档以及数组文件需要经过upload接口


调用dify的upload的代码：import requests
import json
import os
from tkinter import Tk, filedialog
import mimetypes


def select_file():
    """打开文件选择窗口并返回选择的文件路径"""
    root = Tk()
    root.withdraw()  # 隐藏主窗口
    file_path = filedialog.askopenfilename(
        title="选择要上传的文件",
        filetypes=[("All Files", "*.*"),
                   ("Images", "*.png;*.jpg;*.jpeg;*.webp;*.gif"),
                   ("Documents", "*.pdf;*.docx;*.txt")]
    )
    return file_path


def upload_file(file_path, user_id="auto_test"):
    """上传文件到Dify服务，完全参照curl命令格式"""
    # 使用curl命令中提供的URL
    url = "http://118.145.74.50:24131/v1/files/upload"

    # 使用curl命令中提供的API密钥格式
    api_key = "app-5RAOHTGq802qwkzK0PYwVFt2"  # 替换为您的实际API密钥

    try:
        # 获取文件名和MIME类型
        file_name = os.path.basename(file_path)
        mime_type, _ = mimetypes.guess_type(file_path)

        # 如果无法确定MIME类型，默认使用"application/octet-stream"
        if not mime_type:
            mime_type = "application/octet-stream"

        # 准备文件数据 - 完全参照curl命令格式
        files = {
            'file': (file_name, open(file_path, 'rb'), mime_type)
        }
        print(files)
        # 准备表单数据
        data = {
            'user': user_id
        }

        # 准备请求头 - 完全参照curl命令格式
        headers = {
            'Authorization': f'Bearer {api_key}'
        }

        # 发送POST请求
        response = requests.post(url, headers=headers, files=files, data=data)

        # 检查响应状态码
        if response.status_code == 200 or response.status_code == 201:
            try:
                return response.json()
            except json.JSONDecodeError:
                return {
                    "id": "unknown",
                    "name": file_name,
                    "status": "success",
                    "message": "文件上传成功，但无法解析JSON响应",
                    "response_text": response.text
                }
        else:
            return {
                "error": f"上传失败，状态码：{response.status_code}",
                "status_code": response.status_code,
                "response_text": response.text
            }

    except FileNotFoundError:
        return {"error": f"文件未找到: {file_path}"}
    except PermissionError:
        return {"error": f"无权限访问文件: {file_path}"}
    except requests.exceptions.RequestException as e:
        return {"error": f"请求异常: {str(e)}"}
    except Exception as e:
        return {"error": f"处理文件时出错: {str(e)}"}


def run_dify_workflow():
    """主工作流函数"""
    # 1. 让用户选择文件
    file_path = select_file()
    if not file_path:
        return {"status": "cancelled", "message": "未选择文件，操作已取消"}

    # 2. 上传文件
    upload_result = upload_file(file_path)

    # 3. 返回结果
    if "error" in upload_result:
        return {
            "status": "error",
            "message": "文件上传失败",
            "details": upload_result
        }
    elif "id" in upload_result:
        return {
            "status": "success",
            "message": "文件上传成功",
            "file_info": upload_result
        }
    else:
        return {
            "status": "partial_success",
            "message": "文件可能已上传，但响应格式异常",
            "response": upload_result
        }


if __name__ == "__main__":
    result = run_dify_workflow()
    print(json.dumps(result, indent=2, ensure_ascii=False))



正式调用dify的agent的代码：import requests
import os
import json
import datetime

def ask_question(qs):
    anstmp=run_dify_workflow(qs)
    print(anstmp)
    return anstmp

def get_question():
    root_path=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    qs_path=os.path.join(root_path,'question','question.txt')
    as_path=os.path.join(root_path,'answer','a')
    as2_path = os.path.join(root_path,'answer','a')
    with open(qs_path, 'r', encoding='utf-8') as f:
        content=f.read()
    docs=content.split('\n')
    qs_num=len(docs)
    cur_time=datetime.datetime.now()
    cur_timestamp=cur_time.strftime('%Y%m%d%H%M%S')
    asname=f"nswer_{cur_timestamp}"
    asname2 = f"nswer_include_think_{cur_timestamp}"
    for i in range(len(docs)):
        # print(ask_question(docs[i]))
        ans=ask_question(docs[i])
        # print(ans)
        with open(as2_path+asname2, 'a+', encoding='utf-8') as f:
            f.write('\n')
            f.write("<问题>")
            f.write(str(i+1))
            f.write(":")
            f.write(docs[i])
            f.write('\n')
            f.write(ans)
            f.write('\n')
        with open(as_path+asname, 'a+', encoding='utf-8') as f:
            # f.write('\n')
            # f.write("<问题>")
            # f.write(str(i+1))
            # f.write(":")
            # f.write(docs[i])
            # f.write('\n')
            if "</think>" in ans:
                ans2 = ans.split("</think>")[1].strip()
            else:
                ans2 = ans  # 或其他默认处理
            f.write(ans2)
            f.write('\n')

        # ans[i]=ask_question(docs[i])
    return docs

def run_dify_workflow(qs):
    # 配置参数
    print(qs)
    url = "http://10.255.200.11:8001/v1/chat-messages"
    api_key = "app-kx53lR6KnEJ47XG4a5tyXqOt"  # 你的API密钥
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json',
    }

    # 请求数据
    data = {
        "inputs": {},
        "query": qs,
        "response_mode": "blocking",
        "conversation_id": "",
        "user": "auto_test"
    }
    try:
        response = requests.post(url, headers=headers, data=json.dumps(data))
        response_data = response.json()

        if response.status_code == 200:
            # 处理可能的列表或字典响应
            if isinstance(response_data, list):
                # 如果是列表，取第一个元素（根据实际情况调整）
                return response_data[0].get('answer', 'No answer field found')
            elif isinstance(response_data, dict):
                return response_data.get('answer', 'No answer field found')
            else:
                return str(response_data)  # 其他类型的响应
        else:
            print(f"Error: {response.status_code}, {response.text}")
            return f"Error: {response.status_code}, {response.text}"

    except requests.exceptions.ConnectTimeout:
        return "连接超时，跳过此请求"
    except requests.exceptions.RequestException as e:
        print(f"请求出错: {e}")
        return f"请求出错: {e}"
if __name__ == "__main__":
    get_question()




综上所述，parameter类型的智能体，要请求响应，得在前端调用后端得invoke，后端得invoke判断类型是dialogue还是parameter；如果是parameter，input的数据是否要先经过upload修饰拼接一遍；拼接好参数最后再正式调用dify


参数结构：
upload返回的部分参数：
图片：{
    "id": "b30dff0c-8c8b-419d-b719-504bdbab9e77",
    "name": "1749542839629.jpg",
    "size": 339960,
    "extension": "jpg",
    "mime_type": "image/jpeg",
    "created_by": "d51fd782-9211-49ba-b38d-2e8d300b5013",
    "created_at": 1751497142,
    "preview_url": null
}


文本：
{
  "status": "success",
  "message": "文件上传成功",
  "file_info": {
    "id": "ccf538cc-0803-4f1f-bcc0-6d9b26cbac94",
    "name": "1749521223030.jpg",
    "size": 409255,
    "extension": "jpg",
    "mime_type": "image/jpeg",
    "created_by": "81d7b192-4145-48d9-bfbf-620af1fb2637",
    "created_at": 1751490004,
    "preview_url": null
  }
}


拼接后正式请求的参数：
{
    "id": "666d5179-b9aa-4a06-81ae-afaed43a1d24",
    "name": "\u5f00\u59cb\u751f\u6210",
    "inputs": {
        "image": [
            {
                "dify_model_identity": "__dify__file__",
                "id": null,
                "tenant_id": "b5c2e5fb-1c76-4364-bb8d-86d007a5208f",
                "type": "image",
                "transfer_method": "local_file",
                "remote_url": "http://118.145.74.50:24131/files/eefd2946-bce9-4f62-8d3c-b14390d807f6/file-preview?timestamp=1751488688&nonce=7ce2aea4a15068744ba5e413049b62a3&sign=hy2PGCvFB8_Nh_5c3xCOUQnjefGPLr31K4-a3L5qEYs=",
                "related_id": "eefd2946-bce9-4f62-8d3c-b14390d807f6",
                "filename": "1749542153416.jpg",
                "extension": ".jpg",
                "mime_type": "image/jpeg",
                "size": 25601
            }
        ],
        "prompt": "12"
    },
    "status": "normal",
    "introduction": "\u6b22\u8fce\u4f7f\u7528\u56fe\u751f\u56fe\uff01\n\n\u4e0a\u4f20\u56fe\u7247\u5e76\u8f93\u5165\u8981\u6c42\uff0c\u5373\u53ef\u6309\u7167\u60a8\u7684\u8981\u6c42\u751f\u6210\n\n\u26a0\ufe0f\u672c\u529f\u80fd\u65e0\u6cd5\u5904\u7406\u771f\u4eba\u7167\u7247\n\n\u672a\u6765\u76f8\u673a\uff0c\u68a6\u60f3\u804c\u4e1a\uff0c\u8bf7\u70b9\u51fbhttp://118.145.74.50:24131/chat/xALhElSrukIXOez0\n\u4f60\u53ef\u4ee5\u8f93\u5165\uff1a\n1\ufe0f\u20e3\u201c\u628a\u56fe\u7247\u80cc\u666f\u6539\u4e3a\u665a\u4e0a\u201d \n2\ufe0f\u20e3 \u201c\u628a\u4eba\u7269\u8868\u60c5\u6539\u4e3a\u9ad8\u5174\u7684\u201d\n3\ufe0f\u20e3 \u201c\u5728\u56fe\u7247\u4e0b\u65b9\u52a0\u4e0a\u201c\u4e0a\u8bfe\u5566\u201d\u4e09\u4e2a\u5b57\u201d  \u8fd8\u6709\u66f4\u591a\u5e94\u7528\u573a\u666f\u7b49\u4f60\u63a2\u7d22\uff01",
    "created_at": 1751488691,
    "updated_at": 1751488691
}

{"response_mode":"streaming","conversation_id":"666d5179-b9aa-4a06-81ae-afaed43a1d24","files":[],"query":"开始生成","inputs":{"prompt":"12","image":[{"type":"image","transfer_method":"local_file","url":"","upload_file_id":"b30dff0c-8c8b-419d-b719-504bdbab9e77"}]},"parent_message_id":"46decd36-0c79-4eda-ad08-d5ac90b7bd60"}


{
    "id": "da3f5e80-6fbd-4eeb-b1a8-7fbe0b26d7bd",
    "name": "\u5f00\u59cb\u751f\u6210",
    "inputs": {
        "prompt": "5",
        "bool": "\u662f",
        "gender": "\u7537",
        "image": {
            "dify_model_identity": "__dify__file__",
            "id": null,
            "tenant_id": "b5c2e5fb-1c76-4364-bb8d-86d007a5208f",
            "type": "image",
            "transfer_method": "local_file",
            "remote_url": "http://118.145.74.50:24131/files/140c4d4d-afe6-4ec5-add5-364b12ab371d/file-preview?timestamp=1751498741&nonce=380d4d6380669ccb69d5d70682bd8599&sign=QEV2ooeA8U_xzEcbzSAHsWpeMx0oMDoRxEW8ieayHGc=",
            "related_id": "140c4d4d-afe6-4ec5-add5-364b12ab371d",
            "filename": "1749542839629.jpg",
            "extension": ".jpg",
            "mime_type": "image/jpeg",
            "size": 339960
        }
    },
    "status": "normal",
    "introduction": "\u60a8\u597d,\u6b22\u8fce\u4f7f\u7528\u672a\u6765\u804c\u4e1a\u56fe\u7247\u751f\u6210\u667a\u80fd\u4f53,\u8bf7\u4e0a\u4f20\u60a8\u7684\u56fe\u7247\u548c\u68a6\u60f3\u804c\u4e1a,\u5728\u5feb\u901f\u751f\u6210\u91cc\u9762\u9009\u62e9\"\u662f\"\u6216\u8005\"\u5426\",\u5728\u6027\u522b\u91cc\u9009\u62e9\"\u7537\"\u6216\"\u5973\",\u5728\u5bf9\u8bdd\u6846\u91cc\u8f93\u5165\u5f00\u59cb\u751f\u6210\u5427!",
    "created_at": 1751498747,
    "updated_at": 1751498747
}