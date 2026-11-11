import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm, cm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    KeepTogether,
    HRFlowable,
)
from reportlab.pdfgen import canvas

# ── CANVAS PERSONNALISÉ POUR PAGINATION "PAGE X SUR Y" ET EN-TÊTES ÉLÉGANTS ──
class NumberedCanvas(canvas.Canvas):
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
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            # Page de couverture : aucun en-tête ni pied de page
            return

        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#71717a"))

        # En-tête
        self.drawString(20 * mm, 282 * mm, "LONSIDE STUDIO  //  MANUEL OFFICIEL DE DIRECTION ARTISTIQUE")
        self.drawRightString(190 * mm, 282 * mm, "VERSION 2.0 — AVRIL 2026")
        self.setStrokeColor(colors.HexColor("#e4e4e7"))
        self.setLineWidth(0.5)
        self.line(20 * mm, 280 * mm, 190 * mm, 280 * mm)

        # Pied de page
        self.line(20 * mm, 15 * mm, 190 * mm, 15 * mm)
        self.drawString(20 * mm, 11 * mm, "CONFIDENTIEL & USAGE INTERNE — STUDIO D'INGÉNIERIE LOGICIELLE HAUTE VÉLOCITÉ")
        page_str = f"PAGE {self._pageNumber} / {page_count}"
        self.drawRightString(190 * mm, 11 * mm, page_str)
        self.restoreState()


def create_da_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
        topMargin=22 * mm,
        bottomMargin=22 * mm,
    )

    styles = getSampleStyleSheet()

    # Nuances de la charte monochrome Lonside
    C_BLACK = colors.HexColor("#09090b")
    C_DARK = colors.HexColor("#18181b")
    C_BODY = colors.HexColor("#27272a")
    C_MUTED = colors.HexColor("#71717a")
    C_LIGHT = colors.HexColor("#f4f4f5")
    C_SURFACE = colors.HexColor("#fafafa")
    C_BORDER = colors.HexColor("#e4e4e7")

    # Typographies et styles
    style_cover_brand = ParagraphStyle(
        "CoverBrand",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=14,
        textColor=C_MUTED,
        textTransform="uppercase",
        letterSpacing=4,
    )

    style_cover_title = ParagraphStyle(
        "CoverTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=34,
        leading=38,
        textColor=C_BLACK,
    )

    style_cover_subtitle = ParagraphStyle(
        "CoverSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=13,
        leading=18,
        textColor=C_MUTED,
    )

    style_h1 = ParagraphStyle(
        "Heading1_Custom",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=18,
        leading=22,
        textColor=C_BLACK,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True,
    )

    style_h2 = ParagraphStyle(
        "Heading2_Custom",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=16,
        textColor=C_DARK,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True,
    )

    style_body = ParagraphStyle(
        "Body_Custom",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=14,
        textColor=C_BODY,
        spaceAfter=6,
    )

    style_body_bold = ParagraphStyle(
        "BodyBold_Custom",
        parent=style_body,
        fontName="Helvetica-Bold",
        textColor=C_BLACK,
    )

    style_callout = ParagraphStyle(
        "Callout_Custom",
        parent=styles["Normal"],
        fontName="Helvetica-Oblique",
        fontSize=9.5,
        leading=14,
        textColor=C_DARK,
    )

    style_table_header = ParagraphStyle(
        "TableHeader",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8.5,
        leading=11,
        textColor=colors.white,
    )

    style_table_cell = ParagraphStyle(
        "TableCell",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=11,
        textColor=C_BODY,
    )

    style_table_code = ParagraphStyle(
        "TableCode",
        parent=styles["Normal"],
        fontName="Courier",
        fontSize=8,
        leading=10,
        textColor=C_BLACK,
    )

    story = []

    # ══════════════════════════════════════════════════════════════════════════
    # PAGE 1 : COUVERTURE ÉDITORIALE HAUTE COUTURE
    # ══════════════════════════════════════════════════════════════════════════
    story.append(Spacer(1, 30 * mm))
    story.append(Paragraph("LONSIDE STUDIO", style_cover_brand))
    story.append(Spacer(1, 10 * mm))
    story.append(Paragraph("DIRECTION ARTISTIQUE & DESIGN SYSTEM", style_cover_title))
    story.append(Spacer(1, 6 * mm))
    story.append(Paragraph("Le Manuel de Référence Graphique, Typographique et d'Interaction", style_cover_subtitle))
    story.append(Spacer(1, 12 * mm))

    story.append(HRFlowable(width="100%", thickness=1.5, color=C_BLACK, spaceAfter=15 * mm))

    manifeste_text = """
    <b>Lonside Studio</b> incarne l'antithèse du bruit visuel et des tendances éphémères. 
    Inspirée des standards de rigueur des plus grands studios mondiaux (<i>Linear, Stripe Press, Work & Co, Braun / Dieter Rams</i>), 
    notre identité repose sur un principe fondateur : <b>l'extrême précision technique au service d'une clarté absolue</b>. 
    Ce document formalise chaque règle chromatique, typographique, géométrique et dynamique qui constitue la signature Lonside.
    """
    
    callout_data = [[
        Paragraph(manifeste_text, style_callout)
    ]]
    callout_table = Table(callout_data, colWidths=[170 * mm])
    callout_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_SURFACE),
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('LEFTPADDING', (0,0), (-1,-1), 16),
        ('RIGHTPADDING', (0,0), (-1,-1), 16),
        ('TOPPADDING', (0,0), (-1,-1), 16),
        ('BOTTOMPADDING', (0,0), (-1,-1), 16),
    ]))
    story.append(callout_table)

    story.append(Spacer(1, 25 * mm))

    meta_data = [
        [Paragraph("<b>Statut :</b> Officiel & Validé", style_table_cell), Paragraph("<b>Version :</b> 2.0 (High-Precision)", style_table_cell)],
        [Paragraph("<b>Rôle Éditeur :</b> Directeur Artistique & Lead Architecte", style_table_cell), Paragraph("<b>Date d'Effet :</b> Avril 2026", style_table_cell)],
        [Paragraph("<b>Périmètre :</b> Web, Plateforme, Documents & Mobile", style_table_cell), Paragraph("<b>Classification :</b> Production Ready", style_table_cell)],
    ]
    meta_table = Table(meta_data, colWidths=[85 * mm, 85 * mm])
    meta_table.setStyle(TableStyle([
        ('LINEABOVE', (0,0), (-1,0), 0.5, C_BORDER),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(meta_table)

    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════════════════════
    # PAGE 2 : SOMMAIRE & I. VISION & PHILOSOPHIE DE MARQUE
    # ══════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("SOMMAIRE EXÉCUTIF", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=6 * mm))

    sommaire_items = [
        ("01", "Vision & Philosophie Esthétique", "L'élégance de la retenue, le rejet du bruit et l'esprit d'atelier."),
        ("02", "Système Chromatique Monochrome", "Palette officielle, surfaces techniques, contrastes WCAG AA."),
        ("03", "Système Typographique & Hiérarchie", "Antonio variable, Inter, Geist Mono et l'accent éditorial Serif."),
        ("04", "Règles Géométriques & Design Tokens", "La norme rounded-xl (12px), bordures de 1px et padding d'air."),
        ("05", "Composants Emblématiques & Anatomie", "Hero, Cartouche d'Atelier Designjoy, Cartes Projets, Tiroir Latéral."),
        ("06", "Motion & Dynamisme Sensoriel", "Courbes cubiques Apple/Linear, morphing burger et fluidité 60fps."),
        ("07", "Rigueur Responsive & Mobile-First", "Architecture sans débordement, protection min-w-0, cibles 44px+."),
        ("08", "Matrice d'Intégrité (Do's & Don'ts)", "Règles de conformité strictes pour pérenniser l'identité."),
    ]

    sommaire_data = []
    for num, title, desc in sommaire_items:
        sommaire_data.append([
            Paragraph(f"<b>{num}</b>", style_table_code),
            Paragraph(f"<b>{title}</b><br/><font color='#71717a'>{desc}</font>", style_table_cell)
        ])
    t_sommaire = Table(sommaire_data, colWidths=[15 * mm, 155 * mm])
    t_sommaire.setStyle(TableStyle([
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('LINEBELOW', (0,0), (-1,-1), 0.5, colors.HexColor("#f4f4f5")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_sommaire)

    story.append(Spacer(1, 8 * mm))
    story.append(Paragraph("01. VISION & PHILOSOPHIE ESTHÉTIQUE", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=5 * mm))

    story.append(Paragraph(
        "La direction artistique de Lonside Studio découle directement de son positionnement stratégique : <b>un studio d'ingénierie logicielle d'élite qui livre des produits en production dès 14 jours</b>. Là où le marché du développement web s'est saturé de dégradés agressifs, d'animations gadgets et de maquettes surchargées, Lonside adopte une posture de <i>Brutalisme Raffiné</i> et d'<i>Épure Suisse</i>.",
        style_body
    ))
    story.append(Paragraph(
        "<b>Les trois piliers philosophiques :</b>",
        style_body_bold
    ))

    piliers_data = [
        [
            Paragraph("<b>1. L'Artisanat Senior (Craft)</b>", style_table_cell),
            Paragraph("Pas de fioritures gratuites. Chaque composant graphique est taillé avec le soin d'un artisan d'art : bords au pixel près, contraste optimal, typographie lisible instantanément.", style_table_cell)
        ],
        [
            Paragraph("<b>2. La Vélocité Silencieuse</b>", style_table_cell),
            Paragraph("Le design ne doit jamais ralentir l'utilisateur. Zéro effet de parallaxe lourd, zéro bibliothèque JavaScript surchargée : un chargement instantané à 60 images par seconde.", style_table_cell)
        ],
        [
            Paragraph("<b>3. La Souveraineté & la Vérité</b>", style_table_cell),
            Paragraph("Refus des artifices marketing. Les chiffres sont mis en valeur avec franchise (-42% de ruptures, dès 14 jours), le code cédé sur GitHub est célébré comme une œuvre durable.", style_table_cell)
        ]
    ]
    t_piliers = Table(piliers_data, colWidths=[55 * mm, 115 * mm])
    t_piliers.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_SURFACE),
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_piliers)

    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════════════════════
    # PAGE 3 : II. SYSTÈME CHROMATIQUE & III. TYPOGRAPHIE
    # ══════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("02. SYSTÈME CHROMATIQUE MONOCHROME", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=5 * mm))

    story.append(Paragraph(
        "La palette Lonside est <b>rigoureusement monochrome</b>. Elle exclut formellement les couleurs saturées (bleus électriques, pourpres, néons) au profit d'un étagement de valeurs de gris savamment dosées, garantissant un ratio de contraste supérieur aux normes <b>WCAG 2.1 AA (4.5:1 minimum)</b>.",
        style_body
    ))

    color_data = [
        [Paragraph("NOM TOKEN", style_table_header), Paragraph("CODE HEX", style_table_header), Paragraph("USAGE SÉMANTIQUE DÉDIÉ", style_table_header), Paragraph("CONTRASTE", style_table_header)],
        [Paragraph("Black Pure", style_table_cell), Paragraph("<code>#000000</code>", style_table_code), Paragraph("Boutons primaires, textes d'impact, icônes phares", style_table_cell), Paragraph("21:1 (Max)", style_table_cell)],
        [Paragraph("Obsidian Carbon", style_table_cell), Paragraph("<code>#09090b</code>", style_table_code), Paragraph("Surfaces sombres de contraste, badges d'état", style_table_cell), Paragraph("19.8:1", style_table_cell)],
        [Paragraph("Zinc 700 (Body)", style_table_cell), Paragraph("<code>#3f3f46</code>", style_table_code), Paragraph("Corps de texte principal, descriptions courantes", style_table_cell), Paragraph("7.2:1 (AAA)", style_table_cell)],
        [Paragraph("Zinc 500 (Muted)", style_table_cell), Paragraph("<code>#71717a</code>", style_table_code), Paragraph("Métadonnées monospace, dates, mentions secondaires", style_table_cell), Paragraph("4.6:1 (AA)", style_table_cell)],
        [Paragraph("Zinc 200 (Borders)", style_table_cell), Paragraph("<code>#e4e4e7</code>", style_table_code), Paragraph("Filets de séparation, bordures de cartes et modales", style_table_cell), Paragraph("Structure", style_table_cell)],
        [Paragraph("Technical Surface", style_table_cell), Paragraph("<code>#fafafc</code>", style_table_code), Paragraph("Fond des cartes d'artisanat, cartouches d'atelier", style_table_cell), Paragraph("Fond noble", style_table_cell)],
        [Paragraph("White Pure", style_table_cell), Paragraph("<code>#ffffff</code>", style_table_code), Paragraph("Canvas général, fond des modales, cartes activées", style_table_cell), Paragraph("Fond neutre", style_table_cell)],
    ]
    t_colors = Table(color_data, colWidths=[38 * mm, 32 * mm, 75 * mm, 25 * mm])
    t_colors.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_BLACK),
        ('GRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_SURFACE]),
    ]))
    story.append(t_colors)

    story.append(Spacer(1, 8 * mm))
    story.append(Paragraph("03. SYSTÈME TYPOGRAPHIQUE & HIÉRARCHIE", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=5 * mm))

    story.append(Paragraph(
        "Lonside emploie un quatuor typographique complémentaire, créant un équilibre parfait entre autorité industrielle, lisibilité universelle et cachet éditorial haut de gamme :",
        style_body
    ))

    typo_data = [
        [Paragraph("FAMILLE", style_table_header), Paragraph("RÔLE & EXPRESSION", style_table_header), Paragraph("ÉCHELLE & CASSE", style_table_header), Paragraph("STYLE EXEMPLE", style_table_header)],
        [
            Paragraph("<b>Antonio</b><br/><font color='#71717a'>Variable Display</font>", style_table_cell),
            Paragraph("Titrage d'impact architectural, identité visuelle frontale, chiffres de métriques phares.", style_table_cell),
            Paragraph("24px à 64px<br/><b>MAJUSCULE STRICTE</b>", style_table_cell),
            Paragraph("<b>VOTRE PRODUIT DIGITAL</b>", style_table_code)
        ],
        [
            Paragraph("<b>Inter</b><br/><font color='#71717a'>Geometric Sans</font>", style_table_cell),
            Paragraph("Corps de texte, argumentaires, articles légaux, ergonomie des formulaires.", style_table_cell),
            Paragraph("13px à 18px<br/>Bas-de-casse régulier", style_table_cell),
            Paragraph("Conception fiable dès 14 jours.", style_table_cell)
        ],
        [
            Paragraph("<b>Geist Mono</b><br/><font color='#71717a'>Technical Mono</font>", style_table_cell),
            Paragraph("Métadonnées, délais (JOURS), labels d'engagements, tarification et code.", style_table_cell),
            Paragraph("10px à 12px<br/><b>UPPERCASE ESPACÉ</b>", style_table_cell),
            Paragraph("<code>01 // 14 JOURS OUVRÉS</code>", style_table_code)
        ],
        [
            Paragraph("<b>Serif Italic</b><br/><font color='#71717a'>Editorial Warmth</font>", style_table_cell),
            Paragraph("Touche humaine et chaleureuse inspirée de Designjoy, emphase des promesses clés.", style_table_cell),
            Paragraph("28px à 48px<br/>Italique minuscule", style_table_cell),
            Paragraph("<i>« vous ne reviendrez jamais »</i>", style_table_cell)
        ],
    ]
    t_typo = Table(typo_data, colWidths=[36 * mm, 62 * mm, 36 * mm, 36 * mm])
    t_typo.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_BLACK),
        ('GRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_SURFACE]),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_typo)

    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════════════════════
    # PAGE 4 : IV. RÈGLES GÉOMÉTRIQUES & V. ANATOMIE DES COMPOSANTS
    # ══════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("04. RÈGLES GÉOMÉTRIQUES & DESIGN TOKENS", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=5 * mm))

    geom_items = [
        ("La Règle d'Or des Rayons (rounded-xl)", "Tous les éléments interactifs (boutons d'action, badges de statut, cartes d'offres et formulaires) adoptent rigoureusement un rayon de <b>12 pixels (rounded-xl)</b>. Cette constante élimine l'incohérence visuelle et donne un caractère unifié et tactile."),
        ("L'Exception Architecturale (rounded-none)", "Le panneau latéral de détail de projet (DossierDrawer) supprime délibérément tout arrondi gauche (<b>rounded-none</b>). Il s'ancre brutalement sur l'arête droite de l'écran, matérialisant une découpe franche inspirée des plans d'architectes."),
        ("Micro-Bordures Définies (1px hairline)", "Aucun élément ne repose sur des ombres floues artificielles. Les délimitations sont assurées par des micro-bordures de <b>1px avec opacité calibrée</b> (border-black/[0.08] sur fond clair, border-white/[0.12] sur surface sombre)."),
        ("Calibrage Tactile Mobile (Touch Targets)", "Sur smartphone et tablette, toute zone interactive possède une surface minimale de <b>44x44px (idéalement 48px de hauteur)</b> afin de respecter scrupuleusement les recommandations ergonomiques Apple HIG et WCAG 2.1."),
    ]

    for title, desc in geom_items:
        story.append(Paragraph(f"• <b>{title} :</b> {desc}", style_body))

    story.append(Spacer(1, 8 * mm))
    story.append(Paragraph("05. COMPOSANTS EMBLÉMATIQUES & ANATOMIE", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=5 * mm))

    comp_data = [
        [Paragraph("COMPOSANT", style_table_header), Paragraph("STRUCTURE & ANATOMIE TECHNIQUE", style_table_header), Paragraph("BÉNÉFICE PERCEPTIF", style_table_header)],
        [
            Paragraph("<b>Header & Navbar</b>", style_table_cell),
            Paragraph("Hauteur 56px, fond verre dépoli (white/95 + backdrop-blur), logo uppercase Antonio, liens monospace espacés, sélecteur de langue dropdown et CTA noir 40px.", style_table_cell),
            Paragraph("Légèreté aérienne, flottaison sereine au-dessus du contenu.", style_table_cell)
        ],
        [
            Paragraph("<b>Cartouche d'Atelier</b><br/><font color='#71717a'>Inspiration Designjoy</font>", style_table_cell),
            Paragraph("Conteneur rounded-2xl/3xl, fond blanc sur surface zinc-50, texte narratif direct sans intermédiaire, combiné au titre d'impact avec accentuation italique.", style_table_cell),
            Paragraph("Création immédiate de confiance par l'incarnation d'artisan senior.", style_table_cell)
        ],
        [
            Paragraph("<b>Cartes Projets</b><br/><font color='#71717a'>WorkSection</font>", style_table_cell),
            Paragraph("Cartes rounded-xl, étiquette délai en haut à droite, titre client Antonio, métrique en gras (-42%) et lien 'Détails →' avec protection anti-débordement.", style_table_cell),
            Paragraph("Densité d'information maîtrisée, zéro scroll horizontal parasite.", style_table_cell)
        ],
        [
            Paragraph("<b>Tiroir Latéral</b><br/><font color='#71717a'>DossierDrawer</font>", style_table_cell),
            Paragraph("En-tête à deux niveaux : barre utilitaire d'actions (badge délai + bouton site + croix 36px) surmontant la zone titre et industrie complète en pleine largeur.", style_table_cell),
            Paragraph("Hiérarchie irréprochable : aucun texte tronqué par manque de place.", style_table_cell)
        ],
        [
            Paragraph("<b>Grille Tarifaire</b><br/><font color='#71717a'>PricingSection</font>", style_table_cell),
            Paragraph("Trois forfaits fermes étagés. Carte vedette Sprint Scale avec badge RECOMMANDÉ débordant (-top-3) sans clipping grâce à l'overflow maîtrisé.", style_table_cell),
            Paragraph("Transparence totale, certitude budgétaire contractuelle scellée.", style_table_cell)
        ],
    ]
    t_comp = Table(comp_data, colWidths=[40 * mm, 80 * mm, 50 * mm])
    t_comp.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_BLACK),
        ('GRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_SURFACE]),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_comp)

    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════════════════════
    # PAGE 5 : VI. MOTION, VII. RESPONSIVE & VIII. DO'S AND DON'TS
    # ══════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("06. MOTION & DYNAMISME SENSORIEL", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=5 * mm))

    story.append(Paragraph(
        "Chez Lonside, l'animation n'est pas un spectacle : c'est un <b>vecteur de compréhension physique</b> et de continuité spatiale. Nous refusons les animations linéaires saccadées au profit d'équations de mouvement inspirées de l'ingénierie logicielle d'Apple et de Linear :",
        style_body
    ))

    motion_points = [
        ("Courbe de Bézier Signature", "Toutes les transitions spatiales (tiroir, menu burger, dropdown) emploient la courbe cubique <code>cubic-bezier(0.16, 1, 0.3, 1)</code> sur une durée calibrée de <b>300 millisecondes</b>. Cette courbe offre une accélération vive suivie d'une décélération soyeuse quasi-organique."),
        ("Morphing Burger en Croix (X)", "Les trois traits du menu mobile se métamorphosent géométriquement sans saut d'image : la barre médiane s'efface en réduction d'échelle (scale-x-0) tandis que les barres extrêmes pivotent et convergent pour former une croix symétrique parfaite."),
        ("Cycle de Vie Double-rAF", "Pour prévenir tout flash blanc au montage du DOM, l'apparition des overlays utilise une séquence à double <code>requestAnimationFrame</code> garantissant un pré-positionnement hors-écran avant l'animation d'entrée."),
        ("Matière & Texture Analogique", "L'écran bénéficie d'un micro-bruit vectoriel SVG à 1.5% d'opacité (BrandNoise) couplé à une vidéo monochrome feutrée (StudioAtmosphere), conférant une profondeur de papier d'art à l'ensemble."),
    ]
    for m_title, m_desc in motion_points:
        story.append(Paragraph(f"• <b>{m_title} :</b> {m_desc}", style_body))

    story.append(Spacer(1, 6 * mm))
    story.append(Paragraph("07. RIGUEUR RESPONSIVE & MOBILE-FIRST", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=5 * mm))

    story.append(Paragraph(
        "Plus de 55% des fondateurs découvrent Lonside sur smartphone. Le site applique une discipline chirurgicale anti-débordement :",
        style_body
    ))
    story.append(Paragraph(
        "1. <b>Protection min-w-0 universelle :</b> Chaque conteneur flex et cellule de grille CSS intègre <code>min-w-0</code> pour forcer le respect de la largeur d'écran sans blowout horizontal.<br/>"
        "2. <b>Adaptation contextuelle des libellés :</b> Les textes d'action passent intelligemment de format complet sur grand écran (ex. <i>Détails du projet →</i>) à format concis sur mobile (<i>Détails →</i>) via des classes réactives.<br/>"
        "3. <b>Unification SSOT de la navigation :</b> La barre desktop et le menu burger consomment strictement le même tableau <code>navLinks</code> (Single Source of Truth), interdisant toute disparité de parcours.",
        style_body
    ))

    story.append(Spacer(1, 6 * mm))
    story.append(Paragraph("08. MATRICE D'INTÉGRITÉ (DO'S & DON'TS)", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=5 * mm))

    dodont_data = [
        [Paragraph("CE QUI EST STRICTEMENT OBLIGATOIRE (DO)", style_table_header), Paragraph("CE QUI EST FORMELLEMENT PROSCRIT (DON'T)", style_table_header)],
        [
            Paragraph("• Conserver la palette purement monochrome (Noir, Blanc, Zinc).<br/>"
                      "• Utiliser Antonio en majuscules pour les titres majeurs.<br/>"
                      "• Systématiser le rayon rounded-xl (12px) pour les boutons et cartes.<br/>"
                      "• Garantir une hauteur minimale de 44px sur mobile.<br/>"
                      "• Laisser respirer les données chiffrées avec Geist Mono.<br/>"
                      "• Donner 100% de largeur aux libellés d'industrie dans le tiroir.<br/>"
                      "• Documenter chaque composant selon les principes DDD.", style_table_cell),
            Paragraph("• <b>JAMAIS</b> d'ombres colorées violettes, bleues ou néon.<br/>"
                      "• <b>JAMAIS</b> de polices scriptes, manuscrites ou décoratives.<br/>"
                      "• <b>JAMAIS</b> de dégradés multicolores en arrière-plan.<br/>"
                      "• <b>JAMAIS</b> de texte tronqué arbitrairement par manque d'espace.<br/>"
                      "• <b>JAMAIS</b> d'animation linéaire sèche sans courbe de Bézier.<br/>"
                      "• <b>JAMAIS</b> de mention dépréciée ('étude de cas').<br/>"
                      "• <b>JAMAIS</b> de dépendance externe lourde pour des micro-effets.", style_table_cell),
        ]
    ]
    t_dodont = Table(dodont_data, colWidths=[85 * mm, 85 * mm])
    t_dodont.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), C_BLACK),
        ('BACKGROUND', (1,0), (1,0), colors.HexColor("#7f1d1d")),
        ('GRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BACKGROUND', (0,1), (0,1), colors.white),
        ('BACKGROUND', (1,1), (1,1), colors.HexColor("#fef2f2")),
    ]))
    story.append(t_dodont)

    story.append(Spacer(1, 10 * mm))
    story.append(Paragraph(
        "<b>Document certifié conforme par la Direction Artistique de Lonside Studio.</b><br/>"
        "<font color='#71717a'>Applicable immédiatement à tous les développements web, mobiles et documents de marque.</font>",
        style_body
    ))

    # Génération du document final
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF généré avec succès à l'emplacement : {output_path}")


if __name__ == "__main__":
    out_dir = r"c:\Users\KevinTSAGUE\project\lonside\docs"
    os.makedirs(out_dir, exist_ok=True)
    pdf_path = os.path.join(out_dir, "LONSIDE_DIRECTION_ARTISTIQUE_OFFICIELLE.pdf")
    create_da_pdf(pdf_path)

