import os
from PIL import Image

carpeta_img = "img" # Nombre de tu carpeta de imágenes

for archivo in os.listdir(carpeta_img):
    if archivo.lower().endswith(('.png', '.jpg', '.jpeg')):
        ruta_completa = os.path.join(carpeta_img, archivo)
        
        # Abrir la imagen original
        img = Image.open(ruta_completa)
        
        # Generar el nuevo nombre de archivo
        nombre_sin_ext = os.path.splitext(archivo)[0]
        nueva_ruta = os.path.join(carpeta_img, f"{nombre_sin_ext}.webp")
        
        # Guardar en formato webp optimizado
        img.save(nueva_ruta, "webp", quality=85)
        print(f"✅ Convertido: {archivo} -> {nombre_sin_ext}.webp")
        
        # Quita el '#' de la siguiente línea si quieres que se borre el original (.png/.jpeg) automáticamente
        # os.remove(ruta_completa) 

print("¡Conversión terminada!")