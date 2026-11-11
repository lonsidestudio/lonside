import os
from PIL import Image, ImageDraw, ImageFont

def get_font(size, bold=False):
    font_paths = [
        "C:\\Windows\\Fonts\\segoeuib.ttf" if bold else "C:\\Windows\\Fonts\\segoeui.ttf",
        "C:\\Windows\\Fonts\\arialbd.ttf" if bold else "C:\\Windows\\Fonts\\arial.ttf",
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

def create_media_formats_diagram(out_path):
    width = 1500
    height = 550
    img = Image.new("RGB", (width, height), "#ffffff")
    draw = ImageDraw.Draw(img)

    c_black = "#09090b"
    c_dark = "#18181b"
    c_gray = "#71717a"
    c_border = "#e4e4e7"
    c_surface = "#fafafa"

    f_title = get_font(28, bold=True)
    f_badge = get_font(13, bold=True)
    f_box_h = get_font(20, bold=True)
    f_desc = get_font(13.5, bold=False)

    draw.text((60, 35), "LONSIDE STUDIO : LA GRILLE DES FORMATS ÉDITORIAUX", fill=c_black, font=f_title)
    draw.text((60, 75), "STRUCTURE DE CONTENU DE HAUTE PRÉCISION POUR YOUTUBE & MÉDIA", fill=c_gray, font=f_badge)

    col_w = 420
    col_h = 360
    col_y = 120
    gap = 40

    cards = [
        ("Lonside Conversations", "40 à 60 MINUTES · LONG-FORMAT",
         "• Entretiens de fond avec builders et fondateurs\n• Décryptage de parcours et choix stratégiques\n• Échecs réels passés sous silence\n• Dilemmes d'architecture logicielle\n• Objectif : Réseau d'influence & autorité"),
        ("Inside the Build", "15 à 25 MINUTES · DÉMO & CODE",
         "• Découverte des coulisses techniques réelles\n• Partage d'écran et tableau blanc\n• Autopsie de pannes et décisions d'infra\n• Cas concrets sans mise en scène\n• Objectif : Crédibilité & preuve par le code"),
        ("The Turning Point", "5 à 10 MINUTES · FORMAT PUNCHY",
         "• Récits condensés d'un moment de bascule\n• Reconversion, pivot in extremis, crise surmontée\n• Format dynamique à fort potentiel viral\n• Déclinaison YouTube Shorts & LinkedIn\n• Objectif : Portée organique & acquisition")
    ]

    for idx, (title, tag, body) in enumerate(cards):
        cx = 60 + idx * (col_w + gap)
        draw.rounded_rectangle([cx, col_y, cx + col_w, col_y + col_h], radius=16, fill=c_surface, outline=c_border, width=2)
        
        # Header box
        draw.rounded_rectangle([cx, col_y, cx + col_w, col_y + 65], radius=16, fill=c_black)
        draw.rectangle([cx, col_y + 35, cx + col_w, col_y + 65], fill=c_black)
        draw.text((cx + 25, col_y + 20), title, fill="#ffffff", font=f_box_h)

        draw.text((cx + 25, col_y + 85), tag, fill=c_gray, font=f_badge)
        draw.line([cx + 25, col_y + 110, cx + col_w - 25, col_y + 110], fill=c_border, width=1)
        draw.multiline_text((cx + 25, col_y + 130), body, fill=c_dark, font=f_desc, spacing=9)

    img.save(out_path, quality=95)
    print(f"Schéma Formats Éditoriaux créé : {out_path}")

if __name__ == "__main__":
    docs_dir = os.path.dirname(__file__)
    create_media_formats_diagram(os.path.join(docs_dir, "diagram_media_formats.png"))

