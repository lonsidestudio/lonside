import os
from PIL import Image, ImageDraw, ImageFont

def get_font(size, bold=False):
    # Essayons Arial ou Segoe UI ou consolas sur Windows
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

def create_brand_architecture_diagram(out_path):
    width = 1400
    height = 700
    img = Image.new("RGB", (width, height), "#ffffff")
    draw = ImageDraw.Draw(img)

    # Couleurs Lonside
    c_black = "#09090b"
    c_dark = "#18181b"
    c_gray = "#71717a"
    c_light = "#f4f4f5"
    c_border = "#e4e4e7"
    c_white = "#ffffff"

    f_title = get_font(32, bold=True)
    f_sub = get_font(18, bold=False)
    f_box_h = get_font(24, bold=True)
    f_box_sub = get_font(15, bold=False)
    f_badge = get_font(13, bold=True)

    # 1. Carte Marque Principale : lonside.
    box_w = 540
    box_h = 170
    bx = (width - box_w) // 2
    by = 50
    draw.rounded_rectangle([bx, by, bx + box_w, by + box_h], radius=20, fill=c_white, outline=c_black, width=2)
    draw.text((bx + 30, by + 28), "lonside.", fill=c_black, font=f_title)
    draw.text((bx + 30, by + 75), "MARQUE PRINCIPALE · HOLDING MODERNE", fill=c_gray, font=f_badge)
    draw.text((bx + 30, by + 105), "Technology · People · Ideas", fill=c_dark, font=f_sub)

    # Flèche / embranchement vertical
    mid_x = width // 2
    draw.line([mid_x, by + box_h, mid_x, by + box_h + 60], fill=c_black, width=2)
    # Ligne horizontale de split
    split_y = by + box_h + 60
    left_x = 380
    right_x = 1020
    draw.line([left_x, split_y, right_x, split_y], fill=c_black, width=2)
    draw.line([left_x, split_y, left_x, split_y + 40], fill=c_black, width=2)
    draw.line([right_x, split_y, right_x, split_y + 40], fill=c_black, width=2)

    # Branche Gauche : Lonside Software
    sb_w = 480
    sb_h = 240
    sb_x = left_x - sb_w // 2
    sb_y = split_y + 40
    draw.rounded_rectangle([sb_x, sb_y, sb_x + sb_w, sb_y + sb_h], radius=20, fill="#fafafa", outline=c_border, width=2)
    draw.text((sb_x + 30, sb_y + 25), "</> Lonside Software", fill=c_black, font=f_box_h)
    draw.text((sb_x + 30, sb_y + 65), "ÉDITION DE LOGICIELS SAAS & CLOUD", fill=c_gray, font=f_badge)
    desc_l = "• Conception & édition de plateformes propriétaires\n• Modèle récurrent B2B (ARR souverain)\n• Produits étiquetés « A Product by Lonside »\n• Briques logicielles issues des besoins terrain"
    draw.multiline_text((sb_x + 30, sb_y + 98), desc_l, fill=c_dark, font=f_box_sub, spacing=8)

    # Branche Droite : Lonside Studio
    st_w = 480
    st_h = 240
    st_x = right_x - st_w // 2
    st_y = split_y + 40
    draw.rounded_rectangle([st_x, st_y, st_x + st_w, st_y + st_h], radius=20, fill="#fafafa", outline=c_border, width=2)
    draw.text((st_x + 30, st_y + 25), "🎙️ Lonside Studio", fill=c_black, font=f_box_h)
    draw.text((st_x + 30, st_y + 65), "MÉDIA TECH, INTERVIEWS & CULTURE BUILDER", fill=c_gray, font=f_badge)
    desc_r = "• Lonside Conversations (Entretiens 40-60 min)\n• Inside the Build (Coulisses & code en direct)\n• The Turning Point (Moments décisifs & pivots)\n• Moteur d'attention et distribution à 0 € CAC"
    draw.multiline_text((st_x + 30, st_y + 98), desc_r, fill=c_dark, font=f_box_sub, spacing=8)

    # Flywheel liaison bidirectionnelle au bas
    fy = sb_y + sb_h + 40
    draw.line([left_x, sb_y + sb_h, left_x, fy], fill=c_gray, width=1)
    draw.line([right_x, st_y + st_h, right_x, fy], fill=c_gray, width=1)
    draw.line([left_x, fy, right_x, fy], fill=c_black, width=2)
    draw.text((mid_x - 190, fy - 18), "◄── LE FLYWHEEL SYNERGIQUE LONSIDE ──►", fill=c_black, font=f_badge)

    img.save(out_path, quality=95)
    print(f"Schéma Architecture de Marque créé : {out_path}")

def create_roadmap_timeline_diagram(out_path):
    width = 1500
    height = 650
    img = Image.new("RGB", (width, height), "#ffffff")
    draw = ImageDraw.Draw(img)

    c_black = "#09090b"
    c_dark = "#18181b"
    c_gray = "#71717a"
    c_border = "#e4e4e7"
    c_surface = "#fafafa"

    f_title = get_font(28, bold=True)
    f_badge = get_font(13, bold=True)
    f_step_num = get_font(20, bold=True)
    f_step_h = get_font(19, bold=True)
    f_desc = get_font(14, bold=False)

    draw.text((60, 40), "ROADMAP STRATÉGIQUE LONSIDE (2027 — 2029+)", fill=c_black, font=f_title)
    draw.text((60, 80), "PLAN OPÉRATIONNEL ÉCHELONNÉ EN 3 PHASES MAJEURES", fill=c_gray, font=f_badge)

    col_w = 420
    col_h = 440
    col_y = 130
    gap = 40

    phases = [
        ("01", "2027", "CONSOLIDER LES SERVICES", 
         "Maintenant · Phase Fondatrice", 
         "• Développer la clientèle & portfolio\n• Sprints Launch (14j) & Scale (30j)\n• Régie senior d'immersion\n• Financement sur fonds propres\n• Marge nette > 70%\n• R&D terrain : identification des pains"),
        ("02", "2028", "DÉPLOYER LE MÉDIA", 
         "Ensuite · Moteur d'Attention", 
         "• Lonside Conversations (Interviews)\n• Inside the Build (Démos réelles)\n• The Turning Point (Pivots tech)\n• Production Lean (0 studio fixe)\n• Réseau d'influence & Inbound direct\n• Audience qualifiée de décideurs"),
        ("03", "2029+", "ÉDITER DES PRODUITS", 
         "Progressivement · SaaS Holding", 
         "• Logiciels SaaS B2B propriétaires\n• Label « A Product by Lonside »\n• Distribution à 0 € CAC via le média\n• Modèle 'Boring Tech' haute densité\n• Transition ARR > Prestations\n• Actifs numériques valorisables")
    ]

    for idx, (num, year, title, subtitle, details) in enumerate(phases):
        cx = 60 + idx * (col_w + gap)
        draw.rounded_rectangle([cx, col_y, cx + col_w, col_y + col_h], radius=16, fill=c_surface, outline=c_border, width=2)
        
        # En-tête de carte
        draw.rounded_rectangle([cx, col_y, cx + col_w, col_y + 70], radius=16, fill=c_black)
        draw.rectangle([cx, col_y + 40, cx + col_w, col_y + 70], fill=c_black)
        draw.text((cx + 25, col_y + 22), f"PHASE {num}  //  {year}", fill="#ffffff", font=f_step_num)

        draw.text((cx + 25, col_y + 90), title, fill=c_black, font=f_step_h)
        draw.text((cx + 25, col_y + 120), subtitle, fill=c_gray, font=f_badge)

        draw.line([cx + 25, col_y + 145, cx + col_w - 25, col_y + 145], fill=c_border, width=1)
        draw.multiline_text((cx + 25, col_y + 165), details, fill=c_dark, font=f_desc, spacing=10)

    img.save(out_path, quality=95)
    print(f"Schéma Roadmap Timeline créé : {out_path}")

if __name__ == "__main__":
    docs_dir = os.path.dirname(__file__)
    create_brand_architecture_diagram(os.path.join(docs_dir, "diagram_brand_architecture.png"))
    create_roadmap_timeline_diagram(os.path.join(docs_dir, "diagram_roadmap_timeline.png"))
