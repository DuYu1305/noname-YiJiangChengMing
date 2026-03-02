import os
import shutil
from PIL import Image

# 设置目标尺寸
target_width = 530
target_height = 750

# 设置目标文件夹
target_folder = "images"

# 创建目标文件夹（如果不存在）
if not os.path.exists(target_folder):
    os.makedirs(target_folder)

# 遍历当前目录及其子目录
for root, dirs, files in os.walk('.'):
    for filename in files:
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif')):
            file_path = os.path.join(root, filename)
            try:
                # 打开图片并获取尺寸
                with Image.open(file_path) as img:
                    width, height = img.size

                # 检查图片尺寸是否为 530x750
                if width == target_width and height == target_height:
                    # 计算目标文件路径
                    target_file_path = os.path.join(target_folder, filename)
                    # 复制文件
                    shutil.copy2(file_path, target_file_path)
                    print(f"Copied {file_path} to {target_file_path}")
            except Exception as e:
                print(f"Error processing {file_path}: {e}")