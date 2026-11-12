import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    HRFlowable,
)
from reportlab.pdfgen import canvas
from PIL import Image, ImageDraw, ImageFont

# ==============================================================================
# 1. REPORTLAB VECTOR PDF GENERATION (2-PAGE A4 FLYER)
# ==============================================================================

class FlyerCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_decorations(self, num_pages):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#71717a"))

        # Header bar
        self.setStrokeColor(colors.HexColor("#e4e4e7"))
        self.setLineWidth(0.5)
        self.line(15 * mm, 285 * mm, 195 * mm, 285 * mm)
        self.drawString(15 * mm, 287 * mm, "LONSIDE  //  SUPPORT COMMERCIAL & OFFRE D'INGÉNIERIE")
        self.drawRightString(195 * mm, 287 * mm, "TECHNOLOGY · PEOPLE · IDEAS")

        # Footer bar
        self.line(15 * mm, 12 * mm, 195 * mm, 12 * mm)
        self.drawString(15 * mm, 8 * mm, "LONSIDE STUDIO & SOFTWARE — DOCUMENT DE PRÉSENTATION OFFICIEL")
        face_label = "FACE A · POSITIONNEMENT & STANDARDS" if self._pageNumber == 1 else "FACE B · CATALOGUE DES OFFRES & CONTACT"
        self.drawRightString(195 * mm, 8 * mm, f"{face_label}  ({self._pageNumber}/{num_pages})")
        self.restoreState()

def build_flyer_pdf(output_pdf):
    doc = SimpleDocTemplate(
        output_pdf,
        pagesize=A4,
        leftMargin=15 * mm,
        rightMargin=15 * mm,
        topMargin=18 * mm,
        bottomMargin=16 * mm,
    )

    styles = getSampleStyleSheet()
    
    # Custom Typography Palette
    c_black = colors.HexColor("#09090b")
    c_dark = colors.HexColor("#18181b")
    c_gray = colors.HexColor("#71717a")
    c_light = colors.HexColor("#fafafa")
    c_border = colors.HexColor("#e4e4e7")
    c_white = colors.HexColor("#ffffff")

    title_logo = ParagraphStyle(
        "FlyerLogo",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=28,
        leading=32,
        textColor=c_black,
    )

    badge_style = ParagraphStyle(
        "FlyerBadge",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10,
        textColor=c_white,
        alignment=1, # Center
    )

    tagline_style = ParagraphStyle(
        "FlyerTagline",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=c_gray,
    )

    hero_title = ParagraphStyle(
        "FlyerHeroTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=21,
        leading=26,
        textColor=c_black,
    )

    hero_subtitle = ParagraphStyle(
        "FlyerHeroSub",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=11,
        leading=16,
        textColor=c_dark,
    )

    body_manifesto = ParagraphStyle(
        "FlyerManifesto",
        parent=styles["Normal"],
        fontName="Helvetica-Oblique",
        fontSize=10,
        leading=15,
        textColor=c_dark,
    )

    card_header = ParagraphStyle(
        "FlyerCardH",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=17,
        textColor=c_black,
    )

    card_sub = ParagraphStyle(
        "FlyerCardSub",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=11,
        textColor=c_gray,
    )

    card_body = ParagraphStyle(
        "FlyerCardBody",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=13.5,
        textColor=c_dark,
    )

    card_body_bold = ParagraphStyle(
        "FlyerCardBodyBold",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9,
        leading=13.5,
        textColor=c_black,
    )

    story = []

    # ==========================================================================
    # FACE A (RECTO) : POSITIONNEMENT, MANIFESTE & LES 4 STANDARDS
    # ==========================================================================
    
    # Header Row : Logo + Tagline + Badge
    badge_p = Paragraph("COMMERCIAL ONE-PAGER · 2027", badge_style)
    badge_cell = Table([[badge_p]], colWidths=[55 * mm], rowHeights=[7 * mm])
    badge_cell.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_black),
        ("ROUNDEDCORNERS", [3, 3, 3, 3]),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("TOPPADDING", (0, 0), (-1, -1), 1),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
    ]))

    header_table = Table([
        [
            Paragraph("<b>lonside.</b><br/><font color='#71717a' size='9'>Technology · People · Ideas</font>", title_logo),
            badge_cell
        ]
    ], colWidths=[125 * mm, 55 * mm])
    header_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (1, 0), (1, 0), "RIGHT"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 4 * mm))

    # Hero Hook
    story.append(Paragraph("Concevoir des architectures numériques d'exception.<br/>Sans compromis, sans dette.", hero_title))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph("Lonside est une holding technologique moderne réunissant un studio d'ingénierie logicielle haute performance (<b>Lonside Software</b>) et un média d'immersion bâtisseurs (<b>Lonside Studio</b>). Nous opérons en mode commando pour les fondateurs, directeurs techniques et décideurs qui exigent la précision absolue.", hero_subtitle))
    story.append(Spacer(1, 4 * mm))

    # Manifesto Box (Encadré Fond Noir)
    manifesto_p = Paragraph(
        "<b>LE CONSTAT :</b> 80% des refontes logicielles s'essoufflent sous le poids d'une dette technique invisible, de temps de chargement désastreux et de réunions de cadrage stériles.<br/><br/>"
        "<b>NOTRE MODÈLE :</b> Nous avons banni les intermédiaires commerciaux et le travail sous-traité. Chez Lonside, chaque projet est piloté directement par un binôme de direction technique senior. Nous livrons des systèmes pérennes, mesurables et souverains, avec une vitesse d'exécution inspirée des plus grandes références internationales.",
        ParagraphStyle("ManWhite", parent=styles["Normal"], fontName="Helvetica", fontSize=9.5, leading=14.5, textColor=c_white)
    )
    man_table = Table([[manifesto_p]], colWidths=[180 * mm])
    man_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_black),
        ("ROUNDEDCORNERS", [6, 6, 6, 6]),
        ("TOPPADDING", (0, 0), (-1, -1), 5 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 6 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6 * mm),
    ]))
    story.append(man_table)
    story.append(Spacer(1, 6 * mm))

    # 4 Standards Inviolables (Grille 2x2)
    story.append(Paragraph("<b>NOS QUATRE STANDARDS D'INGÉNIERIE INVIOLABLES</b>", card_sub))
    story.append(Spacer(1, 2 * mm))

    p1_content = [
        Paragraph("1. Vitesse & Score 4×95+", card_header),
        Spacer(1, 1 * mm),
        Paragraph("Chaque application est certifiée avec un score Google Lighthouse supérieur à 95 sur tous les axes (Performance, Accessibilité, SEO, Bonnes Pratiques). Vitesse LCP < 1.0s.", card_body)
    ]
    p2_content = [
        Paragraph("2. TypeScript Strict & Zéro Dette", card_header),
        Spacer(1, 1 * mm),
        Paragraph("Next.js 14 App Router, zéro 'any', zéro dépendance circulaire. Une architecture modulaire Domain-Driven Design prête à évoluer pendant 5 ans sans refonte.", card_body)
    ]
    p3_content = [
        Paragraph("3. Direction Artistique Haute Couture", card_header),
        Spacer(1, 1 * mm),
        Paragraph("Minimalisme affirmé, contraste franc, typographie au millimètre et micro-interactions soignées. Un produit qui inspire une confiance immédiate et convertit dès le premier jour.", card_body)
    ]
    p4_content = [
        Paragraph("4. Propriété Intellectuelle Totale", card_header),
        Spacer(1, 1 * mm),
        Paragraph("100% du code source, des pipelines CI/CD et des droits d'auteur vous sont transférés sans intermédiaire. Zéro dépendance cachée, zéro lock-in propriétaire.", card_body)
    ]

    grid_data = [
        [p1_content, p2_content],
        [p3_content, p4_content]
    ]

    standards_table = Table(grid_data, colWidths=[88 * mm, 88 * mm])
    standards_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_light),
        ("BOX", (0, 0), (-1, -1), 0.5, c_border),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, c_border),
        ("ROUNDEDCORNERS", [5, 5, 5, 5]),
        ("TOPPADDING", (0, 0), (-1, -1), 4 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(standards_table)
    story.append(Spacer(1, 5 * mm))

    # Bottom Callout Face A
    bottom_callout = Paragraph(
        "<b>AU VERSO :</b> Découvrez le détail de nos 3 offres commando d'ingénierie logicielle (Sprint Launch 14j, Sprint Scale 30j, Immersion Squad) et les conditions du Diagnostic d'Architecture offert.",
        ParagraphStyle("BotCall", parent=styles["Normal"], fontName="Helvetica", fontSize=8.5, leading=12, textColor=c_gray, alignment=1)
    )
    story.append(bottom_callout)

    # ==========================================================================
    # FACE B (VERSO) : CATALOGUE DES 3 OFFRES & APPEL À L'ACTION
    # ==========================================================================
    story.append(PageBreak())

    story.append(Paragraph("<b>LE CATALOGUE DES OFFRES COMMERCIALES</b>", card_sub))
    story.append(Spacer(1, 1 * mm))
    story.append(Paragraph("Trois formats d'ingénierie commando calibrés pour la vitesse et l'impact.", hero_title))
    story.append(Spacer(1, 3 * mm))

    # Offre 1 : Sprint Launch
    o1_header = Paragraph("<b>01 / SPRINT LAUNCH</b>  ·  14 JOURS OUVRÉS", card_sub)
    o1_title = Paragraph("De l'idée au marché en 14 jours, sans friction.", card_header)
    o1_desc = Paragraph(
        "• <b>Périmètre strict :</b> 1 à 3 pages stratégiques (Landing conversion, Page Produit, Booking).<br/>"
        "• <b>Stack & Design :</b> Next.js 14 App Router, Tailwind CSS, animations fluides, formulaires sécurisés.<br/>"
        "• <b>Garantie de résultat :</b> Score Lighthouse 4×95+, SEO technique, DNS sécurisé et CI/CD automatisé.<br/>"
        "• <b>Impact Client :</b> Time-to-market divisé par 4. Taux de conversion moyen : +40% à +85%.",
        card_body
    )
    o1_table = Table([[o1_header], [o1_title], [o1_desc]], colWidths=[180 * mm])
    o1_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_light),
        ("BOX", (0, 0), (-1, -1), 1.0, c_border),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("TOPPADDING", (0, 0), (-1, -1), 2.5 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
    ]))
    story.append(o1_table)
    story.append(Spacer(1, 3 * mm))

    # Offre 2 : Sprint Scale
    o2_header = Paragraph("<b>02 / SPRINT SCALE</b>  ·  30 JOURS OUVRÉS", card_sub)
    o2_title = Paragraph("L'infrastructure applicative prête pour la montée en charge.", card_header)
    o2_desc = Paragraph(
        "• <b>Périmètre élargi :</b> Jusqu'à 7 écrans applicatifs dynamiques (tableaux de bord, filtres temps réel, espace client).<br/>"
        "• <b>Intégrations :</b> Authentification robuste (NextAuth/JWT), flux Stripe Billing et webhooks transactionnels.<br/>"
        "• <b>Résilience :</b> Internationalisation native (i18n), suite complète de tests unitaires (Vitest) et E2E (Playwright).<br/>"
        "• <b>Impact Client :</b> Absorption de 100 000 visites/jour sans latence. Taux de rebond sous 25%.",
        card_body
    )
    o2_table = Table([[o2_header], [o2_title], [o2_desc]], colWidths=[180 * mm])
    o2_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_light),
        ("BOX", (0, 0), (-1, -1), 1.0, c_border),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("TOPPADDING", (0, 0), (-1, -1), 2.5 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
    ]))
    story.append(o2_table)
    story.append(Spacer(1, 3 * mm))

    # Offre 3 : Immersion Squad
    o3_header = Paragraph("<b>03 / IMMERSION SQUAD</b>  ·  TRIMESTRIEL / SEMESTRIEL", card_sub)
    o3_title = Paragraph("Deux directeurs techniques greffés au cœur de votre équipe.", card_header)
    o3_desc = Paragraph(
        "• <b>Le Binôme Senior :</b> 1 Lead Tech Senior + 1 Head of Product & Design intégrés directement dans vos canaux Slack/Teams.<br/>"
        "• <b>Mode Opératoire :</b> 2 cycles de releases en production par semaine, zéro réunion superflue, communication asynchrone.<br/>"
        "• <b>Missions clés :</b> Refonte de Design System, élimination de dette technique critique, accélération de roadmap.<br/>"
        "• <b>Impact Client :</b> Vélocité d'équipe multipliée par 2 (+120%), transfert continu de compétences internes.",
        card_body
    )
    o3_table = Table([[o3_header], [o3_title], [o3_desc]], colWidths=[180 * mm])
    o3_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_light),
        ("BOX", (0, 0), (-1, -1), 1.0, c_border),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("TOPPADDING", (0, 0), (-1, -1), 2.5 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
    ]))
    story.append(o3_table)
    story.append(Spacer(1, 4 * mm))

    # Call To Action Box (Diagnostic Offert)
    cta_title = Paragraph("DIAGNOSTIC D'ARCHITECTURE OFFERT (30 MINUTES)", ParagraphStyle("CtaT", fontName="Helvetica-Bold", fontSize=12, leading=15, textColor=c_white))
    cta_body = Paragraph(
        "Vous planifiez une refonte, un lancement ou vous subissez une dette technique bloquante ?<br/>"
        "Échangez pendant 30 minutes avec un architecte senior Lonside pour évaluer sans détour votre stack, vos temps de réponse et vos gisements d'accélération. <b>Zéro discours commercial, uniquement de l'analyse d'ingénierie concrète.</b>",
        ParagraphStyle("CtaB", fontName="Helvetica", fontSize=9, leading=13.5, textColor=colors.HexColor("#e4e4e7"))
    )
    cta_contact = Paragraph(
        "<b>RÉSERVATION DIRECTE :</b> contact@lonside.com  ·  Disponibilité limitée à 3 nouveaux projets par trimestre.",
        ParagraphStyle("CtaC", fontName="Helvetica-Bold", fontSize=9.5, leading=14, textColor=c_white)
    )

    cta_table = Table([[cta_title], [Spacer(1, 1 * mm)], [cta_body], [Spacer(1, 2 * mm)], [cta_contact]], colWidths=[180 * mm])
    cta_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_black),
        ("ROUNDEDCORNERS", [5, 5, 5, 5]),
        ("TOPPADDING", (0, 0), (-1, -1), 4 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 5 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5 * mm),
    ]))
    story.append(cta_table)

    doc.build(story, canvasmaker=FlyerCanvas)
    print(f"PDF Flyer Commercial généré : {output_pdf}")

# ==============================================================================
# 2. PIL HIGH-RESOLUTION PREVIEW GENERATOR (RECTO & VERSO PNG)
# ==============================================================================

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

def generate_flyer_images(recto_path, verso_path):
    width = 1240
    height = 1754 # Standard A4 at 150 DPI

    c_black = "#09090b"
    c_dark = "#18181b"
    c_gray = "#71717a"
    c_light = "#fafafa"
    c_border = "#e4e4e7"
    c_white = "#ffffff"

    f_logo = get_font(42, bold=True)
    f_sub = get_font(16, bold=False)
    f_badge = get_font(13, bold=True)
    f_h1 = get_font(28, bold=True)
    f_h2 = get_font(20, bold=True)
    f_body = get_font(15, bold=False)
    f_body_bold = get_font(15, bold=True)
    f_small = get_font(12, bold=False)

    # --------------------------------------------------------------------------
    # RECTO (FACE A)
    # --------------------------------------------------------------------------
    img_r = Image.new("RGB", (width, height), c_white)
    draw_r = ImageDraw.Draw(img_r)

    # Top border line
    draw_r.line([70, 70, width - 70, 70], fill=c_border, width=2)
    draw_r.text((70, 45), "LONSIDE  //  SUPPORT COMMERCIAL & INGÉNIERIE LOGICIELLE", fill=c_gray, font=f_small)
    draw_r.text((width - 320, 45), "TECHNOLOGY · PEOPLE · IDEAS", fill=c_gray, font=f_small)

    # Header
    draw_r.text((70, 105), "lonside.", fill=c_black, font=f_logo)
    draw_r.text((70, 160), "Technology · People · Ideas", fill=c_gray, font=f_sub)

    # Badge Top Right
    badge_w = 260
    badge_h = 36
    draw_r.rounded_rectangle([width - 70 - badge_w, 115, width - 70, 115 + badge_h], radius=6, fill=c_black)
    draw_r.text((width - 70 - badge_w + 22, 124), "ONE-PAGER COMMERCIAL · 2027", fill=c_white, font=f_badge)

    # Hero Title
    draw_r.text((70, 230), "Concevoir des architectures numériques d'exception.\nSans compromis, sans dette.", fill=c_black, font=f_h1, spacing=10)

    hero_txt = "Lonside est une holding technologique moderne unissant un studio d'ingénierie logicielle\n(Lonside Software) et un média d'immersion bâtisseurs (Lonside Studio). Nous opérons en mode\ncommando senior pour les fondateurs et décideurs qui exigent la précision absolue."
    draw_r.multiline_text((70, 315), hero_txt, fill=c_dark, font=f_body, spacing=8)

    # Manifesto Box
    man_y = 425
    man_h = 240
    draw_r.rounded_rectangle([70, man_y, width - 70, man_y + man_h], radius=12, fill=c_black)
    man_txt = (
        "LE CONSTAT :\n"
        "80% des refontes logicielles s'essoufflent sous le poids d'une dette technique invisible,\n"
        "de temps de chargement désastreux et de réunions de cadrage stériles.\n\n"
        "NOTRE MODÈLE :\n"
        "Zéro intermédiaire commercial, zéro profil junior. Chaque projet est piloté directement par\n"
        "un binôme de direction technique senior. Nous livrons des briques logicielles robustes,\n"
        "sécurisées et ultra-rapides, avec une rigueur inspirée des plus grandes entreprises mondiales."
    )
    draw_r.multiline_text((105, man_y + 30), man_txt, fill=c_white, font=f_body, spacing=6)

    # Standards Title
    draw_r.text((70, 710), "NOS QUATRE STANDARDS D'INGÉNIERIE INVIOLABLES", fill=c_gray, font=f_badge)

    # 4 Standards Grid
    card_w = (width - 140 - 30) // 2
    card_h = 200

    cards_r = [
        (70, 745, "1. Vitesse & Score 4×95+", "Google Lighthouse supérieur à 95 sur tous les axes\n(Performance, Accessibilité, SEO, Bonnes Pratiques).\nTemps moyen de chargement LCP < 1.0s sur mobile."),
        (70 + card_w + 30, 745, "2. TypeScript Strict & Zéro Dette", "Next.js 14 App Router, zéro 'any', zéro dépendance\ncirculaire. Architecture modulaire Domain-Driven Design\nprête pour 5 ans de scalabilité sans refonte."),
        (70, 745 + card_h + 20, "3. Direction Artistique Haute Couture", "Minimalisme affirmé, contraste franc, typographie au\nmillimètre et micro-interactions soignées. Un design\nqui inspire confiance et convertit dès le premier jour."),
        (70 + card_w + 30, 745 + card_h + 20, "4. Propriété Intellectuelle Totale", "100% du code source, des pipelines CI/CD et des\ndroits d'auteur vous sont transférés sans intermédiaire.\nZéro dépendance cachée, zéro lock-in propriétaire."),
    ]

    for cx, cy, c_title, c_desc in cards_r:
        draw_r.rounded_rectangle([cx, cy, cx + card_w, cy + card_h], radius=10, fill=c_light, outline=c_border, width=2)
        draw_r.text((cx + 25, cy + 25), c_title, fill=c_black, font=f_h2)
        draw_r.multiline_text((cx + 25, cy + 70), c_desc, fill=c_dark, font=f_body, spacing=6)

    # Bottom Callout
    bot_y = 1600
    draw_r.line([70, bot_y, width - 70, bot_y], fill=c_border, width=1)
    draw_r.text((width // 2 - 280, bot_y + 25), "AU VERSO : DÉCOUVREZ NOS 3 OFFRES CLÉS & LE DIAGNOSTIC D'ARCHITECTURE OFFERT ➔", fill=c_gray, font=f_badge)

    # Footer
    draw_r.line([70, height - 70, width - 70, height - 70], fill=c_border, width=2)
    draw_r.text((70, height - 50), "LONSIDE SOFTWARE & STUDIO  //  DOCUMENT COMMERCIAL OFFICIEL", fill=c_gray, font=f_small)
    draw_r.text((width - 320, height - 50), "FACE A · POSITIONNEMENT & STANDARDS", fill=c_gray, font=f_small)

    img_r.save(recto_path, quality=95)
    print(f"Image Flyer Recto générée : {recto_path}")

    # --------------------------------------------------------------------------
    # VERSO (FACE B)
    # --------------------------------------------------------------------------
    img_v = Image.new("RGB", (width, height), c_white)
    draw_v = ImageDraw.Draw(img_v)

    # Top border line
    draw_v.line([70, 70, width - 70, 70], fill=c_border, width=2)
    draw_v.text((70, 45), "LONSIDE  //  CATALOGUE DES OFFRES D'INGÉNIERIE", fill=c_gray, font=f_small)
    draw_v.text((width - 320, 45), "FORFAITS FERMES & CYCLES COURTS", fill=c_gray, font=f_small)

    # Header
    draw_v.text((70, 105), "NOS FORMATS D'INTERVENTION", fill=c_gray, font=f_badge)
    draw_v.text((70, 135), "Trois forfaits d'ingénierie commando sans inertie.", fill=c_black, font=f_h1)

    # 3 Service Cards
    card_v_w = width - 140
    card_v_h = 260
    start_v_y = 210
    gap_v = 25

    offers = [
        (
            "01 / SPRINT LAUNCH  ·  14 JOURS OUVRÉS",
            "De l'idée au marché en 14 jours, sans friction.",
            "• Périmètre strict : 1 à 3 pages stratégiques complètes (Landing conversion, Page Produit, Booking).\n"
            "• Stack & Design : Next.js 14 App Router, Tailwind CSS, animations fluides, formulaires sécurisés.\n"
            "• Standards certifiés : Score Lighthouse 4×95+, SEO technique, DNS sécurisé et déploiement CI/CD automatisé.\n"
            "• Impact Client : Time-to-market divisé par 4. Taux de conversion moyen constaté : +40% à +85%."
        ),
        (
            "02 / SPRINT SCALE  ·  30 JOURS OUVRÉS",
            "L'infrastructure logicielle prête pour l'hyper-croissance.",
            "• Périmètre élargi : Jusqu'à 7 écrans applicatifs dynamiques (tableaux de bord, filtres temps réel, espace client).\n"
            "• Intégrations avancées : Authentification robuste (NextAuth/JWT), flux Stripe Billing et webhooks transactionnels.\n"
            "• Résilience totale : Internationalisation native (i18n), suite de tests automatisés (Vitest unitaire + Playwright E2E).\n"
            "• Impact Client : Scalabilité 100 000 visiteurs/jour sans refonte. Taux de rebond réduit sous la barre des 25%."
        ),
        (
            "03 / IMMERSION SQUAD  ·  TRIMESTRIEL OU SEMESTRIEL",
            "Deux directeurs techniques greffés au cœur de votre équipe.",
            "• Binôme Senior Dédié : 1 Lead Tech / Architecte Senior + 1 Head of Product & Design intégrés sur vos canaux.\n"
            "• Mode Opératoire Commando : 2 cycles de releases en production par semaine, zéro réunion superflue, asynchrone.\n"
            "• Missions stratégiques : Refonte de Design System, élimination de dette technique critique, accélération de roadmap.\n"
            "• Impact Client : Vélocité d'équipe multipliée par 2 (+120%), transfert méthodologique continu vers vos développeurs."
        )
    ]

    for i, (tag, title, desc) in enumerate(offers):
        y = start_v_y + i * (card_v_h + gap_v)
        draw_v.rounded_rectangle([70, y, 70 + card_v_w, y + card_v_h], radius=12, fill=c_light, outline=c_border, width=2)
        draw_v.text((105, y + 25), tag, fill=c_gray, font=f_badge)
        draw_v.text((105, y + 55), title, fill=c_black, font=f_h2)
        draw_v.multiline_text((105, y + 105), desc, fill=c_dark, font=f_body, spacing=7)

    # CTA Box (Fond Noir)
    cta_y = start_v_y + 3 * (card_v_h + gap_v) + 20
    cta_h = 320
    draw_v.rounded_rectangle([70, cta_y, 70 + card_v_w, cta_y + cta_h], radius=14, fill=c_black)
    draw_v.text((105, cta_y + 35), "DIAGNOSTIC D'ARCHITECTURE OFFERT (30 MINUTES)", fill=c_white, font=f_h2)
    
    cta_body_text = (
        "Vous planifiez une refonte, un lancement ou vous subissez une dette technique bloquante ?\n"
        "Échangez pendant 30 minutes avec un architecte senior Lonside pour évaluer sans détour votre stack,\n"
        "vos temps de chargement et vos opportunités d'optimisation.\n\n"
        "Zéro discours commercial. Uniquement de l'analyse d'ingénierie concrète."
    )
    draw_v.multiline_text((105, cta_y + 85), cta_body_text, fill="#e4e4e7", font=f_body, spacing=6)

    # Contact line
    draw_v.line([105, cta_y + 225, width - 105, cta_y + 225], fill="#27272a", width=1)
    draw_v.text((105, cta_y + 245), "RÉSERVATION DIRECTE :  contact@lonside.com", fill=c_white, font=f_h2)
    draw_v.text((width - 450, cta_y + 250), "Disponibilité limitée à 3 projets / trimestre", fill=c_gray, font=f_badge)

    # Footer
    draw_v.line([70, height - 70, width - 70, height - 70], fill=c_border, width=2)
    draw_v.text((70, height - 50), "LONSIDE  //  TECHNOLOGY · PEOPLE · IDEAS", fill=c_gray, font=f_small)
    draw_v.text((width - 320, height - 50), "FACE B · CATALOGUE DES OFFRES & CONTACT", fill=c_gray, font=f_small)

    img_v.save(verso_path, quality=95)
    print(f"Image Flyer Verso générée : {verso_path}")

if __name__ == "__main__":
    os.makedirs("docs", exist_ok=True)
    os.makedirs("public", exist_ok=True)

    # 1. Build ReportLab Vector PDF
    build_flyer_pdf("docs/LONSIDE_FLYER_COMMERCIAL.pdf")
    build_flyer_pdf("public/LONSIDE_FLYER_COMMERCIAL.pdf")

    # 2. Build High-Res PNG Previews
    generate_flyer_images("docs/flyer_commercial_recto.png", "docs/flyer_commercial_verso.png")
    generate_flyer_images("public/flyer_commercial_recto.png", "public/flyer_commercial_verso.png")
