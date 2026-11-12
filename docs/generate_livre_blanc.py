import os
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
)
from reportlab.pdfgen import canvas

# Dimensions exactes 16:9 Widescreen (297mm x 167.0625mm)
PAGE_WIDTH = 297 * mm
PAGE_HEIGHT = 167.0625 * mm
PAGE_16_9 = (PAGE_WIDTH, PAGE_HEIGHT)

class Presentation169Canvas(canvas.Canvas):
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
        # Pas d'en-tête ni pied de page sur la couverture (page 1)
        if self._pageNumber == 1:
            return

        self.saveState()
        self.setFont("Helvetica", 7.5)
        self.setFillColor(colors.HexColor("#71717a"))

        # En-tête épuré
        self.setStrokeColor(colors.HexColor("#e4e4e7"))
        self.setLineWidth(0.5)
        self.line(16 * mm, PAGE_HEIGHT - 12 * mm, PAGE_WIDTH - 16 * mm, PAGE_HEIGHT - 12 * mm)
        self.drawString(16 * mm, PAGE_HEIGHT - 10 * mm, "LONSIDE STUDIO  //  LE GUIDE DU STUDIO")
        self.drawRightString(PAGE_WIDTH - 16 * mm, PAGE_HEIGHT - 10 * mm, "CONCEPTION & INGÉNIERIE LOGICIELLE")

        # Pied de page
        self.line(16 * mm, 11 * mm, PAGE_WIDTH - 16 * mm, 11 * mm)
        self.drawString(16 * mm, 7.5 * mm, "LONSIDE STUDIO — ATELIER INDÉPENDANT D'ARTISANAT LOGICIEL")
        page_str = f"SLIDE {self._pageNumber} / {num_pages}"
        self.drawRightString(PAGE_WIDTH - 16 * mm, 7.5 * mm, page_str)
        self.restoreState()

def create_image_placeholder(width_mm, height_mm, label="Capture d'Écran"):
    p = Paragraph(
        f"<font color='#a1a1aa' size='7'><b>[ {label.upper()} ]</b><br/>Glissez votre visuel ici</font>",
        ParagraphStyle("PlaceH", fontName="Helvetica", fontSize=7, leading=9.5, alignment=1)
    )
    t = Table([[p]], colWidths=[width_mm * mm], rowHeights=[height_mm * mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#fafafa")),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#e4e4e7")),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
    ]))
    return t

def build_whitepaper_16_9_pdf(output_pdf):
    doc = SimpleDocTemplate(
        output_pdf,
        pagesize=PAGE_16_9,
        leftMargin=16 * mm,
        rightMargin=16 * mm,
        topMargin=15 * mm,
        bottomMargin=14 * mm,
    )

    styles = getSampleStyleSheet()

    c_black = colors.HexColor("#09090b")
    c_dark = colors.HexColor("#18181b")
    c_gray = colors.HexColor("#71717a")
    c_light_gray = colors.HexColor("#a1a1aa")
    c_bg_light = colors.HexColor("#fafafa")
    c_border = colors.HexColor("#e4e4e7")
    c_white = colors.HexColor("#ffffff")

    s_cover_tag = ParagraphStyle("CoverTag", fontName="Helvetica-Bold", fontSize=9, leading=12, textColor=c_gray)
    s_cover_logo = ParagraphStyle("CoverLogo", fontName="Helvetica-Bold", fontSize=42, leading=48, textColor=c_black)
    s_cover_title = ParagraphStyle("CoverTitle", fontName="Helvetica-Bold", fontSize=26, leading=32, textColor=c_black)
    s_cover_subtitle = ParagraphStyle("CoverSubtitle", fontName="Helvetica", fontSize=12, leading=17, textColor=c_dark)

    s_chapter_tag = ParagraphStyle("ChapterTag", fontName="Helvetica-Bold", fontSize=8, leading=10, textColor=c_gray)
    s_chapter_title = ParagraphStyle("ChapterTitle", fontName="Helvetica-Bold", fontSize=18, leading=22, textColor=c_black)
    s_section_title = ParagraphStyle("SectionTitle", fontName="Helvetica-Bold", fontSize=11, leading=15, textColor=c_black)

    s_body = ParagraphStyle("BodyCustom", fontName="Helvetica", fontSize=8.5, leading=13, textColor=c_dark)
    s_body_bold = ParagraphStyle("BodyBoldCustom", fontName="Helvetica-Bold", fontSize=8.5, leading=13, textColor=c_black)
    s_pullquote = ParagraphStyle("PullQuote", fontName="Helvetica-Oblique", fontSize=9.5, leading=14, textColor=c_black)

    s_card_tag = ParagraphStyle("CardTag", fontName="Helvetica-Bold", fontSize=7.5, leading=9.5, textColor=c_gray)
    s_card_h = ParagraphStyle("CardH", fontName="Helvetica-Bold", fontSize=11, leading=14, textColor=c_black)
    s_card_p = ParagraphStyle("CardP", fontName="Helvetica", fontSize=8, leading=11.5, textColor=c_dark)

    usable_w = 265 * mm
    col_w_2 = 129 * mm
    col_w_3 = 85 * mm

    story = []

    # ==========================================================================
    # SLIDE 1 : COUVERTURE FORMAT 16:9 ULTRA-AÉRÉE
    # ==========================================================================
    story.append(Spacer(1, 14 * mm))
    story.append(Paragraph("LONSIDE STUDIO  //  LE GUIDE DU STUDIO", s_cover_tag))
    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph("<b>lonside.</b>", s_cover_logo))
    story.append(Spacer(1, 10 * mm))

    story.append(Paragraph("L'Exécution comme Signature :<br/>Votre Produit en Ligne Dès 14 Jours.", s_cover_title))
    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph("Conception et ingénierie de plateformes web sur-mesure pour les fondateurs et dirigeants qui veulent avancer vite.", s_cover_subtitle))
    story.append(Spacer(1, 10 * mm))

    # Repères clés en 4 colonnes aérées
    metrics_data = [
        [
            Paragraph("<b>DÈS 14J</b><br/><font color='#71717a' size='7'>Délai garanti</font>", s_body_bold),
            Paragraph("<b>FORFAIT FIXE</b><br/><font color='#71717a' size='7'>Zéro dépassement</font>", s_body_bold),
            Paragraph("<b>100% À VOUS</b><br/><font color='#71717a' size='7'>Cession GitHub</font>", s_body_bold),
            Paragraph("<b>30 JOURS</b><br/><font color='#71717a' size='7'>Garantie corrective</font>", s_body_bold),
        ]
    ]
    t_metrics = Table(metrics_data, colWidths=[64 * mm, 64 * mm, 64 * mm, 64 * mm])
    t_metrics.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.5, c_border),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, c_border),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("TOPPADDING", (0, 0), (-1, -1), 3 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 2 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 2 * mm),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    story.append(t_metrics)
    story.append(Spacer(1, 12 * mm))

    meta_footer = Paragraph(
        "<b>Édition :</b> 2026 — 2027  ·  <b>Atelier :</b> Lonside Studio  ·  <b>Direction :</b> Kevin T. (Fondateur & Lead Architecte)<br/>"
        "Document officiel d'orientation à destination des fondateurs et dirigeants.",
        ParagraphStyle("MetaFoot", fontName="Helvetica", fontSize=7.5, leading=11, textColor=c_gray)
    )
    story.append(meta_footer)

    # ==========================================================================
    # SLIDE 2 : GENÈSE DE L'ATELIER & VISION (2 COLONNES 16:9)
    # ==========================================================================
    story.append(PageBreak())
    story.append(Paragraph("01 / L'ESPRIT DU STUDIO", s_chapter_tag))
    story.append(Spacer(1, 1 * mm))
    story.append(Paragraph("Genèse & Vision de l'Atelier", s_chapter_title))
    story.append(Spacer(1, 3 * mm))

    col_g_text = [
        Paragraph("La Rupture avec l'Inertie", s_section_title),
        Spacer(1, 1.5 * mm),
        Paragraph(
            "Lonside est né d'un constat sans appel : lancer un produit numérique de haut niveau est devenu inutilement complexe. Trop d'intermédiaires, trop de devis à rallonge, et des semaines perdues en réunions théoriques avant de voir la moindre ébauche concrète.<br/><br/>"
            "« Lonside a été créé avec une conviction simple : permettre aux fondateurs et aux équipes ambitieuses de déployer des produits digitaux de premier plan à la vitesse de la pensée.<br/><br/>"
            "Nous sommes un atelier indépendant de fabrication logicielle. Nous n'employons aucun commercial et nous ne sous-traitons aucun travail. Chaque plateforme est pensée, dessinée et développée directement par un Lead Architecte chevronné. Vous travaillez directement avec ceux qui fabriquent. »",
            s_body
        )
    ]

    col_d_text = [
        Paragraph("Nos Trois Engagements d'Atelier", s_section_title),
        Spacer(1, 1.5 * mm),
        Paragraph(
            "<b>1. La parole tenue sur les délais et le prix :</b><br/>"
            "Forfaits fermes, sans dépassement ni renégociation en cours de route. Votre budget est maîtrisé au centime près dès le premier jour.<br/><br/>"
            "<b>2. Cession totale sur votre propre compte GitHub :</b><br/>"
            "Chaque ligne de code est livrée directement sur votre compte. Vous êtes propriétaire à 100%, sans aucun outil captif ni abonnement forcé.<br/><br/>"
            "<b>3. Le soin de l'artisan prêt pour la vraie vie :</b><br/>"
            "Votre application arrive testée, fluide et prête à accueillir de vrais utilisateurs. Notre garantie corrective de 30 jours prend le relais sans frais.",
            s_body
        )
    ]

    t_p2 = Table([[col_g_text, col_d_text]], colWidths=[col_w_2, col_w_2])
    t_p2.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("RIGHTPADDING", (0, 0), (0, 0), 4 * mm),
        ("LEFTPADDING", (1, 0), (1, 0), 4 * mm),
    ]))
    story.append(t_p2)

    # ==========================================================================
    # SLIDE 3 : TIMELINE "NOTRE FAÇON DE FAIRE" (3 COLONNES VERTICALES 16:9)
    # ==========================================================================
    story.append(PageBreak())
    story.append(Paragraph("02 / NOTRE PROCESSUS D'ATELIER", s_chapter_tag))
    story.append(Spacer(1, 1 * mm))
    story.append(Paragraph("Du Premier Échange à la Mise en Ligne", s_chapter_title))
    story.append(Spacer(1, 1.5 * mm))
    story.append(Paragraph("Une méthode épurée, transparente et cadencée. Vous testez l'avancement de votre produit en direct au fil des jours.", s_body))
    story.append(Spacer(1, 3.5 * mm))

    c_time_1 = [
        Paragraph("<b>ÉTAPE 01  ·  JOURS 1 À 2</b>", s_card_tag),
        Spacer(1, 1 * mm),
        Paragraph("Cadrage & Architecture", s_card_h),
        Spacer(1, 1.5 * mm),
        Paragraph(
            "• Alignement chirurgical sur vos objectifs business et cibles.<br/>"
            "• Modélisation de la base de données et des parcours clés.<br/>"
            "• Scellement du cahier des charges strict pour éviter tout flou.<br/>"
            "• Ouverture de votre canal direct d'atelier (Slack / WhatsApp).<br/><br/>"
            "<b>Livrable :</b> Cahier des charges scellé et architecture validée.",
            s_card_p
        )
    ]

    c_time_2 = [
        Paragraph("<b>ÉTAPE 02  ·  JOURS 3 À 11</b>", s_card_tag),
        Spacer(1, 1 * mm),
        Paragraph("Sprint d'Assemblage", s_card_h),
        Spacer(1, 1.5 * mm),
        Paragraph(
            "• Conception soignée de l'interface et de la logique métier.<br/>"
            "• Intégration des paiements (Stripe) et des outils essentiels.<br/>"
            "• Batterie de tests de stabilité pour garantir une fluidité totale.<br/>"
            "• Lien de prévisualisation actif : vous testez au fil de l'eau.<br/><br/>"
            "<b>Livrable :</b> Version fonctionnelle et démo interactive.",
            s_card_p
        )
    ]

    c_time_3 = [
        Paragraph("<b>ÉTAPE 03  ·  JOURS 12 À 14</b>", s_card_tag),
        Spacer(1, 1 * mm),
        Paragraph("Mise en Ligne & Suivi", s_card_h),
        Spacer(1, 1.5 * mm),
        Paragraph(
            "• Vérifications complètes sur mobile et sécurisation domaine.<br/>"
            "• Transfert intégral du code source sur votre compte GitHub.<br/>"
            "• Visite guidée en vidéo (Loom) pour l'autonomie de votre équipe.<br/>"
            "• Activation immédiate de la garantie corrective 30 jours.<br/><br/>"
            "<b>Livrable :</b> Plateforme live + 30 jours d'assistance sans frais.",
            s_card_p
        )
    ]

    t_timeline_3col = Table([[c_time_1, c_time_2, c_time_3]], colWidths=[col_w_3, col_w_3, col_w_3])
    t_timeline_3col.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_bg_light),
        ("BOX", (0, 0), (-1, -1), 0.5, c_border),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, c_border),
        ("LINEABOVE", (0, 0), (-1, 0), 2.5, c_black),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("TOPPADDING", (0, 0), (-1, -1), 3.5 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3.5 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 3.5 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 3.5 * mm),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(t_timeline_3col)

    # ==========================================================================
    # SLIDE 4 : NOS FORMULES TRANSPARENTES (3 COLONNES VERTICALES 16:9)
    # ==========================================================================
    story.append(PageBreak())
    story.append(Paragraph("03 / NOS FORMULES TRANSPARENTES", s_chapter_tag))
    story.append(Spacer(1, 1 * mm))
    story.append(Paragraph("Des Forfaits Simples, Zéro Dépassement", s_chapter_title))
    story.append(Spacer(1, 1.5 * mm))
    story.append(Paragraph("Chaque formule comprend le cadrage complet, le développement soigné, la cession du code sur votre propre compte et un mois d'assistance sereine.", s_body))
    story.append(Spacer(1, 3.5 * mm))

    c_form_1 = [
        Paragraph("<b>SPRINT LAUNCH</b>", s_card_tag),
        Spacer(1, 1 * mm),
        Paragraph("6 900 €", ParagraphStyle("PPrice", fontName="Helvetica-Bold", fontSize=18, leading=22, textColor=c_black)),
        Paragraph("<font color='#71717a' size='7'>Forfait ferme • 14 jours ouvrés</font>", s_card_tag),
        Spacer(1, 2 * mm),
        Paragraph("Votre première version en ligne, prête pour vos premiers clients.", s_card_h),
        Spacer(1, 1.5 * mm),
        Paragraph(
            "• Application web fluide et responsive mobile<br/>"
            "• Comptes utilisateurs et authentification sécurisée<br/>"
            "• Paiements Stripe configurés (achats ou abonnements)<br/>"
            "• Connexion directe avec vos outils métiers<br/>"
            "• Cession totale du code sur votre GitHub<br/>"
            "• 30 jours d'assistance et garantie corrective",
            s_card_p
        )
    ]

    c_form_2 = [
        Paragraph("<b>SPRINT SCALE (RECOMMANDÉ)</b>", s_card_tag),
        Spacer(1, 1 * mm),
        Paragraph("13 900 €", ParagraphStyle("PPrice", fontName="Helvetica-Bold", fontSize=18, leading=22, textColor=c_black)),
        Paragraph("<font color='#71717a' size='7'>Forfait ferme • 30 jours ouvrés</font>", s_card_tag),
        Spacer(1, 2 * mm),
        Paragraph("Pour les plateformes multi-rôles et flux métier avancés.", s_card_h),
        Spacer(1, 1.5 * mm),
        Paragraph(
            "• <b>Tout le contenu du Sprint Launch, augmenté de :</b><br/>"
            "• Espaces multi-utilisateurs (acheteur, vendeur, admin)<br/>"
            "• Calculs automatisés et traitement temps réel<br/>"
            "• Notifications et flux transactionnels<br/>"
            "• Batterie de tests pour absorber la montée en charge<br/>"
            "• Visite guidée vidéo (Loom) et documentation",
            s_card_p
        )
    ]

    c_form_3 = [
        Paragraph("<b>RÉGIE D'IMMERSION</b>", s_card_tag),
        Spacer(1, 1 * mm),
        Paragraph("Dès 5 500 €", ParagraphStyle("PPrice", fontName="Helvetica-Bold", fontSize=18, leading=22, textColor=c_black)),
        Paragraph("<font color='#71717a' size='7'>Par mois • Flexibilité sans engagement</font>", s_card_tag),
        Spacer(1, 2 * mm),
        Paragraph("Un ingénieur senior intégré directement à vos côtés.", s_card_h),
        Spacer(1, 1.5 * mm),
        Paragraph(
            "• Ingénieur senior dédié à votre feuille de route<br/>"
            "• Collaboration directe dans votre Slack / WhatsApp<br/>"
            "• Sortie rapide de nouvelles fonctionnalités chaque semaine<br/>"
            "• Semaine d'essai de 5 jours pour tester la collaboration<br/>"
            "• Ajustement libre du volume chaque mois",
            s_card_p
        )
    ]

    t_pricing_3col = Table([[c_form_1, c_form_2, c_form_3]], colWidths=[col_w_3, col_w_3, col_w_3])
    t_pricing_3col.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_bg_light),
        ("BOX", (0, 0), (-1, -1), 0.5, c_border),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, c_border),
        ("LINEABOVE", (1, 0), (1, 0), 2.5, c_black),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("TOPPADDING", (0, 0), (-1, -1), 3.5 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3.5 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 3.5 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 3.5 * mm),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(t_pricing_3col)

    # ==========================================================================
    # SLIDE 5 : PRODUIT 1 — BELY (SPLIT 2 COLONNES 16:9)
    # ==========================================================================
    story.append(PageBreak())
    story.append(Paragraph("04 / ÉTUDE DE CAS #1", s_chapter_tag))
    story.append(Spacer(1, 1 * mm))
    story.append(Paragraph("Bely — Mobilité Corporate & Chauffeurs VIP", s_chapter_title))
    story.append(Spacer(1, 3 * mm))

    bely_col_text = [
        Paragraph("<b>L'EXIGENCE DE PONCTUALITÉ</b>", s_card_tag),
        Spacer(1, 1 * mm),
        Paragraph("La plateforme qui connecte entreprises et chauffeurs avec dispatch en direct.", s_card_h),
        Spacer(1, 2 * mm),
        Paragraph(
            "<b>Le Contexte & Le Défi :</b><br/>"
            "Dans le transport de prestige et l'hôtellerie 5 étoiles, la moindre minute de retard ou erreur de facturation compromet irrémédiablement la réputation de service. Bely opérait sur des messageries instantanées sans suivi cartographique pour les concierges, et subissait 40 heures de cauchemar comptable mensuel pour facturer les grands comptes.<br/><br/>"
            "<b>La Réalisation de l'Atelier :</b><br/>"
            "Conception d'un écosystème sur-mesure complet : moteur d'attribution de course géolocalisé en moins de 5 millisecondes, portail entreprise dédié aux hôtels de luxe avec plafonds budgétaires et facturation mensuelle groupée automatisée.<br/><br/>"
            "<b>Résultats Concrets :</b><br/>"
            "• <b>-40 heures</b> de temps administratif mensuel.<br/>"
            "• Calcul de dispatch instantané en moins de <b>5 ms</b>.<br/>"
            "• <b>99.98%</b> de disponibilité de service certifiée.",
            s_body
        )
    ]

    # Blocs d'images côte à côte et grand format
    img_bely_top = create_image_placeholder(127, 60, "Bely : Tour de Contrôle & Dispatch Carte Temps Réel")
    img_bely_b1 = create_image_placeholder(62, 38, "Portail Conciergerie")
    img_bely_b2 = create_image_placeholder(62, 38, "Facturation Groupée")
    t_bely_bot = Table([[img_bely_b1, img_bely_b2]], colWidths=[63.5 * mm, 63.5 * mm])
    t_bely_bot.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE")]))

    bely_col_img = [img_bely_top, Spacer(1, 2 * mm), t_bely_bot]

    t_bely_split = Table([[bely_col_text, bely_col_img]], colWidths=[col_w_2, col_w_2])
    t_bely_split.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("RIGHTPADDING", (0, 0), (0, 0), 4 * mm),
        ("LEFTPADDING", (1, 0), (1, 0), 2 * mm),
    ]))
    story.append(t_bely_split)

    # ==========================================================================
    # SLIDE 6 : PRODUIT 2 — WELQO (SPLIT 2 COLONNES 16:9)
    # ==========================================================================
    story.append(PageBreak())
    story.append(Paragraph("04 / ÉTUDE DE CAS #2", s_chapter_tag))
    story.append(Spacer(1, 1 * mm))
    story.append(Paragraph("Welqo — Conciergerie Immobilière Haut de Gamme", s_chapter_title))
    story.append(Spacer(1, 3 * mm))

    welqo_col_text = [
        Paragraph("<b>L'AUTOMATISATION SANS ERREUR</b>", s_card_tag),
        Spacer(1, 1 * mm),
        Paragraph("Le tableau de bord qui pilote les réservations et opérations en direct.", s_card_h),
        Spacer(1, 2 * mm),
        Paragraph(
            "<b>Le Contexte & Le Défi :</b><br/>"
            "Sur le marché de la location courte durée d'exception, les risques constants de double réservation entre Airbnb et Booking.com et la lenteur des contrats papier bloquaient l'acquisition de nouveaux investisseurs propriétaires.<br/><br/>"
            "<b>La Réalisation de l'Atelier :</b><br/>"
            "Déploiement d'une plateforme d'autorité associant un simulateur interactif de rentabilité financière pour convaincre les propriétaires, une synchronisation calendaire temps réel infaillible et une signature de mandat dématérialisée en 3 minutes.<br/><br/>"
            "<b>Témoignage Client :</b><br/>"
            "<i>« Lonside a propulsé Welqo dans une autre dimension. En moins d'un mois, nous sommes passés d'un modèle artisanal à une plateforme digne des leaders mondiaux. Le simulateur signe de nouveaux propriétaires chaque semaine. »</i>",
            s_body
        )
    ]

    img_welqo_top = create_image_placeholder(127, 60, "Welqo : Simulateur Interactif de Rendement")
    img_welqo_b1 = create_image_placeholder(62, 38, "Calendrier Multi-Plateformes")
    img_welqo_b2 = create_image_placeholder(62, 38, "Espace Propriétaires")
    t_welqo_bot = Table([[img_welqo_b1, img_welqo_b2]], colWidths=[63.5 * mm, 63.5 * mm])
    t_welqo_bot.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE")]))

    welqo_col_img = [img_welqo_top, Spacer(1, 2 * mm), t_welqo_bot]

    t_welqo_split = Table([[welqo_col_text, welqo_col_img]], colWidths=[col_w_2, col_w_2])
    t_welqo_split.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("RIGHTPADDING", (0, 0), (0, 0), 4 * mm),
        ("LEFTPADDING", (1, 0), (1, 0), 2 * mm),
    ]))
    story.append(t_welqo_split)

    # ==========================================================================
    # SLIDE 7 : PRODUIT 3 — MICHI 道 (SPLIT 2 COLONNES 16:9)
    # ==========================================================================
    story.append(PageBreak())
    story.append(Paragraph("04 / ÉTUDE DE CAS #3", s_chapter_tag))
    story.append(Spacer(1, 1 * mm))
    story.append(Paragraph("Michi 道 — Intelligence Supply Chain E-commerce", s_chapter_title))
    story.append(Spacer(1, 3 * mm))

    michi_col_text = [
        Paragraph("<b>LA PROTECTION DU FOND DE ROULEMENT</b>", s_card_tag),
        Spacer(1, 1 * mm),
        Paragraph("L'outil prédictif qui évite les ruptures sans bloquer de trésorerie.", s_card_h),
        Spacer(1, 2 * mm),
        Paragraph(
            "<b>Le Contexte & Le Défi :</b><br/>"
            "Les marques e-commerce en forte accélération subissent un double gouffre financier : des ruptures de stock chroniques sur les produits vedettes (chiffre d'affaires envolé) et un surstockage coûteux sur les articles à faible rotation qui immobilise des dizaines de milliers d'euros de trésorerie dans les entrepôts.<br/><br/>"
            "<b>La Réalisation de l'Atelier :</b><br/>"
            "Conception d'un tableau de bord de réassort prédictif qui connecte les canaux de vente, calcule la date critique de commande en fonction des délais d'usine réels (30 à 90 jours) et reconstitue la demande réelle masquée par les ruptures.<br/><br/>"
            "<b>Résultats Concrets :</b><br/>"
            "• Élimination des ruptures chroniques sur les bestsellers.<br/>"
            "• Protection directe du besoin en fonds de roulement.<br/>"
            "• Automatisation complète des recommandations d'achat.",
            s_body
        )
    ]

    img_michi_top = create_image_placeholder(127, 60, "Michi 道 : Tableau de Bord Prédictif des Ventes")
    img_michi_b1 = create_image_placeholder(62, 38, "Calcul Délais Fournisseurs")
    img_michi_b2 = create_image_placeholder(62, 38, "Analyse ABC & Marge")
    t_michi_bot = Table([[img_michi_b1, img_michi_b2]], colWidths=[63.5 * mm, 63.5 * mm])
    t_michi_bot.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE")]))

    michi_col_img = [img_michi_top, Spacer(1, 2 * mm), t_michi_bot]

    t_michi_split = Table([[michi_col_text, michi_col_img]], colWidths=[col_w_2, col_w_2])
    t_michi_split.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("RIGHTPADDING", (0, 0), (0, 0), 4 * mm),
        ("LEFTPADDING", (1, 0), (1, 0), 2 * mm),
    ]))
    story.append(t_michi_split)

    # ==========================================================================
    # SLIDE 8 : PRODUIT 4 — WEEDIN (SPLIT 2 COLONNES 16:9)
    # ==========================================================================
    story.append(PageBreak())
    story.append(Paragraph("04 / ÉTUDE DE CAS #4", s_chapter_tag))
    story.append(Spacer(1, 1 * mm))
    story.append(Paragraph("WeedIn — Billetterie Événementielle Privée de Prestige", s_chapter_title))
    story.append(Spacer(1, 3 * mm))

    weedin_col_text = [
        Paragraph("<b>L'EXPÉRIENCE INVITÉS IMMERSIVE</b>", s_card_tag),
        Spacer(1, 1 * mm),
        Paragraph("L'application qui simplifie la réservation et la billetterie d'événements.", s_card_h),
        Spacer(1, 2 * mm),
        Paragraph(
            "<b>Le Contexte & Le Défi :</b><br/>"
            "L'organisation d'événements privés réunissant des centaines de convives internationaux se heurte à des coûts colossaux de papeterie papier, un manque de visibilité sur les présences réelles (20% à 30% de gaspillage traiteur) et des risques d'intrusion lors des réceptions exclusives.<br/><br/>"
            "<b>La Réalisation de l'Atelier :</b><br/>"
            "Création d'une plateforme web sur-mesure associant vitrine immersive, parcours RSVP fluide par cérémonie et génération d'e-billets personnalisés avec QR code vérifié à l'accueil en 250 ms.<br/><br/>"
            "<b>Témoignage Client :</b><br/>"
            "<i>« Lonside a sublimé notre événement. Le QR code a permis à la sécurité de fluidifier les entrées de 600 invités sans aucune file d'attente. Le traiteur a reçu les effectifs exacts deux semaines plus tôt. Un travail d'orfèvre. »</i>",
            s_body
        )
    ]

    img_weedin_top = create_image_placeholder(127, 60, "WeedIn : Vitrine Immersive Événementielle")
    img_weedin_b1 = create_image_placeholder(62, 38, "Billets QR Code Sécurisé")
    img_weedin_b2 = create_image_placeholder(62, 38, "Galerie Live Invités")
    t_weedin_bot = Table([[img_weedin_b1, img_weedin_b2]], colWidths=[63.5 * mm, 63.5 * mm])
    t_weedin_bot.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE")]))

    weedin_col_img = [img_weedin_top, Spacer(1, 2 * mm), t_weedin_bot]

    t_weedin_split = Table([[weedin_col_text, weedin_col_img]], colWidths=[col_w_2, col_w_2])
    t_weedin_split.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("RIGHTPADDING", (0, 0), (0, 0), 4 * mm),
        ("LEFTPADDING", (1, 0), (1, 0), 2 * mm),
    ]))
    story.append(t_weedin_split)

    # ==========================================================================
    # SLIDE 9 : DÉMARRER ENSEMBLE (L'ÉCHANGE DE CADRAGE 16:9)
    # ==========================================================================
    story.append(PageBreak())
    story.append(Paragraph("05 / PARLONS DE VOTRE PROJET", s_chapter_tag))
    story.append(Spacer(1, 1 * mm))
    story.append(Paragraph("Démarrons Votre Prochain Produit Ensemble.", s_chapter_title))
    story.append(Spacer(1, 1.5 * mm))

    story.append(Paragraph(
        "Que vous ayez un cahier des charges précis ou une idée à structurer, échangeons en direct avec un Lead Architecte. Nous prenons un nombre strictement limité de projets simultanés pour garantir une attention absolue à chaque détail.",
        s_body
    ))
    story.append(Spacer(1, 3 * mm))

    contact_box_data = [
        [Paragraph("<b>ÉCHANGE DE CADRAGE (15 MINUTES)</b>", ParagraphStyle("CBoxT", fontName="Helvetica-Bold", fontSize=12, leading=15, textColor=c_white))],
        [Paragraph("<font color='#a1a1aa' size='7'>Direct avec Kevin T. (Fondateur & Lead Architecte)</font>", s_card_tag)],
        [Spacer(1, 1.5 * mm)],
        [Paragraph(
            "15 minutes pour évaluer la faisabilité de votre projet, définir le format idéal (Sprint Launch ou Scale) et sceller votre date cible de livraison.<br/><br/>"
            "• <b>Échange direct et sans pression commerciale</b><br/>"
            "• <b>Conseils concrets et actionnables dès le premier échange</b><br/>"
            "• <b>Chiffrage ferme immédiat sans engagement</b>",
            ParagraphStyle("CBoxBody", fontName="Helvetica", fontSize=8.5, leading=13, textColor=colors.HexColor("#e4e4e7"))
        )],
        [Spacer(1, 2 * mm)],
        [Paragraph("<b>RÉSERVEZ VOTRE CRÉNEAU :</b> contact@lonside.com", ParagraphStyle("CBoxContact", fontName="Helvetica-Bold", fontSize=10, leading=14, textColor=c_white))],
        [Paragraph("<font color='#a1a1aa' size='7'>Ou transmettez votre besoin par écrit — Réponse sous 24h ouvrées.</font>", s_card_tag)]
    ]
    t_contact_box = Table(contact_box_data, colWidths=[usable_w])
    t_contact_box.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_black),
        ("ROUNDEDCORNERS", [5, 5, 5, 5]),
        ("TOPPADDING", (0, 0), (-1, -1), 3 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 5 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5 * mm),
    ]))
    story.append(t_contact_box)
    story.append(Spacer(1, 4 * mm))

    story.append(Paragraph(
        "<b>lonside.</b> — Atelier indépendant de conception et de développement de produits digitaux d'exception.<br/>"
        "© 2026 Lonside Studio. Forfaits fermes, délais tenus et cession totale sur votre propre compte GitHub.",
        ParagraphStyle("LegalFinal", fontName="Helvetica", fontSize=7.5, leading=11, textColor=c_gray, alignment=1)
    ))

    doc.build(story, canvasmaker=Presentation169Canvas)
    print(f"Livre Blanc 16:9 Widescreen généré avec succès : {output_pdf}")

if __name__ == "__main__":
    os.makedirs("docs", exist_ok=True)
    os.makedirs("public", exist_ok=True)
    build_whitepaper_16_9_pdf("docs/LONSIDE_LIVRE_BLANC_COMMERCIAL.pdf")
    build_whitepaper_16_9_pdf("public/LONSIDE_LIVRE_BLANC_COMMERCIAL.pdf")
