#!/usr/bin/env python3
"""
Скрипт встраивает все PNG (мокапы + жесты) в index.html как base64.
После запуска index.html работает двойным кликом без сервера.
"""

import os
import base64
import re
from pathlib import Path

# --- Настройки ---
ROOT = Path(__file__).parent
HTML_FILE = ROOT / 'index.html'
MOCKUPS_DIR = ROOT / 'mockups'
SIGNS_DIR = ROOT / 'signs'

# --- Функция: конвертировать PNG в base64 data URL ---
def to_data_url(path):
    with open(path, 'rb') as f:
        data = base64.b64encode(f.read()).decode('ascii')
    return f'data:image/png;base64,{data}'

# --- Собираем словарь всех картинок ---
print('📦 Загружаю картинки...')
images = {}

# Мокапы одежды
for name in ['tshirt', 'longsleeve', 'hoodie', 'sweatshirt', 'tank', 'tote']:
    path = MOCKUPS_DIR / f'{name}.png'
    if path.exists():
        images[f'mockups/{name}.png'] = to_data_url(path)
        print(f'  ✅ {name}.png')

# Жесты (33 буквы)
ru_letters = list('абвгдеёжзийклмнопрстуфхцчшщъыьэюя')
for letter in ru_letters:
    path = SIGNS_DIR / f'{letter}.png'
    if path.exists():
        images[f'signs/{letter}.png'] = to_data_url(path)
        print(f'  ✅ {letter}.png')
    else:
        print(f'  ⚠️  {letter}.png — не найдена')

print(f'\n📊 Всего картинок: {len(images)}')

# --- Читаем index.html ---
print('\n📖 Читаю index.html...')
with open(HTML_FILE, 'r', encoding='utf-8') as f:
    html = f.read()

# --- Заменяем пути на data URL ---
print('🔄 Заменяю пути на base64...')
count = 0

for path, data_url in images.items():
    # Заменяем ВСЕ вхождения пути в одинарных и двойных кавычках
    patterns = [
        f"'{path}'",       # 'mockups/tshirt.png'
        f'"{path}"',       # "mockups/tshirt.png"
    ]
    for pat in patterns:
        if pat in html:
            html = html.replace(pat, f"'{data_url}'" if pat[0] == "'" else f'"{data_url}"')
            count += 1

print(f'  ✅ Заменено: {count} мест')

# --- Сохраняем как index.html (перезаписываем) ---
print('\n💾 Сохраняю index.html...')
with open(HTML_FILE, 'w', encoding='utf-8') as f:
    f.write(html)

size_mb = os.path.getsize(HTML_FILE) / (1024 * 1024)
print(f'\n🎉 Готово! Размер index.html: {size_mb:.2f} МБ')
print('\nТеперь index.html работает двойным кликом — без сервера!')