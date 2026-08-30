from collections import deque
from pathlib import Path
from PIL import Image

src = Path('/home/ubuntu/webdev-static-assets/thabo-liveavatar-9312-clean.png')
dst = Path('/home/ubuntu/webdev-static-assets/thabo-liveavatar-9312-transparent.png')
img = Image.open(src).convert('RGBA')
pix = img.load()
w, h = img.size
seen = bytearray(w * h)
queue = deque()

def is_checkerboard_pixel(x: int, y: int) -> bool:
    r, g, b, a = pix[x, y]
    return a > 0 and max(r, g, b) - min(r, g, b) <= 14 and min(r, g, b) >= 218

for x in range(w):
    for y in (0, h - 1):
        if is_checkerboard_pixel(x, y):
            queue.append((x, y))
for y in range(h):
    for x in (0, w - 1):
        if is_checkerboard_pixel(x, y):
            queue.append((x, y))

while queue:
    x, y = queue.popleft()
    idx = y * w + x
    if seen[idx] or not is_checkerboard_pixel(x, y):
        continue
    seen[idx] = 1
    pix[x, y] = (0, 0, 0, 0)
    for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
        if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx]:
            queue.append((nx, ny))

img.save(dst, 'PNG', optimize=True)
print(dst)
