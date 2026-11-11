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

def create_brand_architecture_diagram(out_path):
    width = 1400
    height = 700
    img = Image.new("RGB", (width, height), "#ffffff")
    draw = ImageDraw.Draw(img)

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
    draw.text((sb_x + 30, sb_y + 25), "[ SOFTWARE ]  Lonside Software", fill=c_black, font=f_box_h)
    draw.text((sb_x + 30, sb_y + 65), "EDITION DE LOGICIELS SAAS & CLOUD", fill=c_gray, font=f_badge)
    desc_l = "- Conception & edition de plateformes proprietaires\n- Modele recurrent B2B (ARR souverain)\n- Produits etiquetes « A Product by Lonside »\n- Briques logicielles issues des besoins terrain"
    draw.multiline_text((sb_x + 30, sb_y + 98), desc_l, fill=c_dark, font=f_box_sub, spacing=8)

    # Branche Droite : Lonside Studio
    st_w = 480
    st_h = 240
    st_x = right_x - st_w // 2
    st_y = split_y + 40
    draw.rounded_rectangle([st_x, st_y, st_x + st_w, st_y + st_h], radius=20, fill="#fafafa", outline=c_border, width=2)
    draw.text((st_x + 30, st_y + 25), "[ STUDIO ]  Lonside Studio", fill=c_black, font=f_box_h)
    draw.text((st_x + 30, st_y + 65), "MEDIA TECH, INTERVIEWS & CULTURE BUILDER", fill=c_gray, font=f_badge)
    desc_r = "- Lonside Conversations (Entretiens 40-60 min)\n- Inside the Build (Coulisses & code en direct)\n- The Turning Point (Moments decisifs & pivots)\n- Moteur d'attention et distribution a 0 EUR CAC"
    draw.multiline_text((st_x + 30, st_y + 98), desc_r, fill=c_dark, font=f_box_sub, spacing=8)

    # Flywheel liaison bidirectionnelle au bas
    fy = sb_y + sb_h + 40
    draw.line([left_x, sb_y + sb_h, left_x, fy], fill=c_gray, width=1)
    draw.line([right_x, st_y + st_h, right_x, fy], fill=c_gray, width=1)
    draw.line([left_x, fy, right_x, fy], fill=c_black, width=2)
    draw.text((mid_x - 170, fy - 18), "<-- LE FLYWHEEL SYNERGIQUE LONSIDE -->", fill=c_black, font=f_badge)

    img.save(out_path, quality=95)
    print(f"Schema Architecture de Marque cree : {out_path}")

def create_roadmap_timeline_diagram(out_path):
    width = 1500
    height = 650
    img = Image.new("RGB", (width, height), "#ffffff")
    draw = ImageDraw.Draw(img)

    c_black = "#09090b"
    c_dark = "#18181b"
    c_gray = "#71717a"
    c_border = "#e4e4e7"

    f_title = get_font(30, bold=True)
    f_phase_h = get_font(22, bold=True)
    f_phase_sub = get_font(14, bold=False)
    f_badge = get_font(13, bold=True)

    draw.text((70, 40), "ROADMAP STRATEGIQUE TRIENNALE LONSIDE", fill=c_black, font=f_title)
    draw.text((70, 85), "Sequence d'execution progressive : 2027 a 2029+", fill=c_gray, font=f_badge)

    col_w = 420
    col_h = 440
    col_y = 140

    # Phase 1: 2027
    x1 = 70
    draw.rounded_rectangle([x1, col_y, x1 + col_w, col_y + col_h], radius=16, fill="#fafafa", outline=c_black, width=2)
    draw.rounded_rectangle([x1 + 25, col_y + 25, x1 + 175, col_y + 55], radius=8, fill=c_black)
    draw.text((x1 + 35, col_y + 32), "PHASE 1  ·  2027", fill="#ffffff", font=f_badge)
    draw.text((x1 + 25, col_y + 75), "Consolider les Services", fill=c_black, font=f_phase_h)
    desc1 = "FOCUS STRATEGIQUE :\n- Prestations d'ingenierie web haute precision\n- Forfaits fixes (Sprint Launch, Scale, Squad)\n- Remplir la tresorerie (reserve 100k EUR)\n- Constituer le reseau initial de clients\n- Eprouver les composants & standards UI\n\nOBJECTIF : Autonomie financiere totale"
    draw.multiline_text((x1 + 25, col_y + 120), desc1, fill=c_dark, font=f_phase_sub, spacing=7)

    # Phase 2: 2028
    x2 = x1 + col_w + 35
    draw.rounded_rectangle([x2, col_y, x2 + col_w, col_y + col_h], radius=16, fill="#fafafa", outline=c_border, width=2)
    draw.rounded_rectangle([x2 + 25, col_y + 25, x2 + 175, col_y + 55], radius=8, fill=c_dark)
    draw.text((x2 + 35, col_y + 32), "PHASE 2  ·  2028", fill="#ffffff", font=f_badge)
    draw.text((x2 + 25, col_y + 75), "Deployer le Media", fill=c_black, font=f_phase_h)
    desc2 = "FOCUS STRATEGIQUE :\n- Lancement de la chaine YouTube Lonside Studio\n- Setup nomade ultra-qualitatif (0 EUR de bail)\n- Format long : Lonside Conversations\n- Format immersif : Inside the Build\n- Format court : The Turning Point\n- Bâtir l'audience de decideurs & fondateurs\n\nOBJECTIF : Notoriete & Inbound dealflow"
    draw.multiline_text((x2 + 25, col_y + 120), desc2, fill=c_dark, font=f_phase_sub, spacing=7)

    # Phase 3: 2029+
    x3 = x2 + col_w + 35
    draw.rounded_rectangle([x3, col_y, x3 + col_w, col_y + col_h], radius=16, fill="#fafafa", outline=c_border, width=2)
    draw.rounded_rectangle([x3 + 25, col_y + 25, x3 + 175, col_y + 55], radius=8, fill=c_dark)
    draw.text((x3 + 35, col_y + 32), "PHASE 3  ·  2029+", fill="#ffffff", font=f_badge)
    draw.text((x3 + 25, col_y + 75), "Editer des Produits", fill=c_black, font=f_phase_h)
    desc3 = "FOCUS STRATEGIQUE :\n- Transformer les besoins repetitifs en SaaS\n- Produits propres : « A Product by Lonside »\n- Distribution organique via le media (CAC = 0 EUR)\n- Monetisation B2B a revenus recurrents (ARR)\n- Bascule progressive du CA services vers produits\n\nOBJECTIF : Croissance exponentielle & valorisation"
    draw.multiline_text((x3 + 25, col_y + 120), desc3, fill=c_dark, font=f_phase_sub, spacing=7)

    img.save(out_path, quality=95)
    print(f"Schema Roadmap Timeline cree : {out_path}")

if __name__ == "__main__":
    os.makedirs("docs", exist_ok=True)
    create_brand_architecture_diagram("docs/diagram_brand_architecture.png")
    create_roadmap_timeline_diagram("docs/diagram_roadmap_timeline.png")
