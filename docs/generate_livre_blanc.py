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
)
from reportlab.pdfgen import canvas

class WhitepaperCanvas(canvas.Canvas):
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
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#71717a"))

        # En-tête sobre
        self.setStrokeColor(colors.HexColor("#e4e4e7"))
        self.setLineWidth(0.5)
        self.line(20 * mm, 282 * mm, 190 * mm, 282 * mm)
        self.drawString(20 * mm, 285 * mm, "LONSIDE STUDIO  //  LE GUIDE DU STUDIO")
        self.drawRightString(190 * mm, 285 * mm, "CONCEPTION & INGÉNIERIE LOGICIELLE")

        # Pied de page
        self.line(20 * mm, 15 * mm, 190 * mm, 15 * mm)
        self.drawString(20 * mm, 10 * mm, "LONSIDE STUDIO — ATELIER INDÉPENDANT D'ARTISANAT LOGICIEL")
        page_str = f"PAGE {self._pageNumber} SUR {num_pages}"
        self.drawRightString(190 * mm, 10 * mm, page_str)
        self.restoreState()

def create_image_placeholder(width_mm, height_mm, label="Emplacement Visuel / Capture d'Écran"):
    p = Paragraph(
        f"<font color='#a1a1aa' size='8'><b>[ {label.upper()} ]</b><br/>Déposez votre capture d'interface ici dans Canva</font>",
        ParagraphStyle("PlaceH", fontName="Helvetica", fontSize=8, leading=11, alignment=1)
    )
    t = Table([[p]], colWidths=[width_mm * mm], rowHeights=[height_mm * mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#fafafa")),
        ("BOX", (0, 0), (-1, -1), 0.8, colors.HexColor("#e4e4e7")),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
    ]))
    return t

def build_whitepaper_pdf(output_pdf):
    doc = SimpleDocTemplate(
        output_pdf,
        pagesize=A4,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
        topMargin=22 * mm,
        bottomMargin=20 * mm,
    )

    styles = getSampleStyleSheet()

    c_black = colors.HexColor("#09090b")
    c_dark = colors.HexColor("#18181b")
    c_gray = colors.HexColor("#71717a")
    c_light_gray = colors.HexColor("#a1a1aa")
    c_bg_light = colors.HexColor("#fafafa")
    c_border = colors.HexColor("#e4e4e7")
    c_white = colors.HexColor("#ffffff")

    s_cover_tag = ParagraphStyle("CoverTag", fontName="Helvetica-Bold", fontSize=10, leading=14, textColor=c_gray)
    s_cover_logo = ParagraphStyle("CoverLogo", fontName="Helvetica-Bold", fontSize=40, leading=46, textColor=c_black)
    s_cover_title = ParagraphStyle("CoverTitle", fontName="Helvetica-Bold", fontSize=26, leading=32, textColor=c_black)
    s_cover_subtitle = ParagraphStyle("CoverSubtitle", fontName="Helvetica", fontSize=12.5, leading=18, textColor=c_dark)

    s_chapter_tag = ParagraphStyle("ChapterTag", fontName="Helvetica-Bold", fontSize=8.5, leading=11, textColor=c_gray)
    s_chapter_title = ParagraphStyle("ChapterTitle", fontName="Helvetica-Bold", fontSize=19, leading=24, textColor=c_black)
    s_section_title = ParagraphStyle("SectionTitle", fontName="Helvetica-Bold", fontSize=12, leading=16, textColor=c_black)

    s_body = ParagraphStyle("BodyCustom", fontName="Helvetica", fontSize=9, leading=14, textColor=c_dark)
    s_body_bold = ParagraphStyle("BodyBoldCustom", fontName="Helvetica-Bold", fontSize=9, leading=14, textColor=c_black)
    s_pullquote = ParagraphStyle("PullQuote", fontName="Helvetica-Oblique", fontSize=10.5, leading=15.5, textColor=c_black)

    s_card_tag = ParagraphStyle("CardTag", fontName="Helvetica-Bold", fontSize=8, leading=10, textColor=c_gray)
    s_card_h = ParagraphStyle("CardH", fontName="Helvetica-Bold", fontSize=12, leading=16, textColor=c_black)
    s_card_p = ParagraphStyle("CardP", fontName="Helvetica", fontSize=8.5, leading=13, textColor=c_dark)

    story = []

    # ==========================================================================
    # PAGE 1 : COUVERTURE DU LIVRE BLANC
    # ==========================================================================
    story.append(Spacer(1, 15 * mm))
    story.append(Paragraph("LONSIDE STUDIO  //  LE GUIDE DU STUDIO", s_cover_tag))
    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph("<b>lonside.</b>", s_cover_logo))
    story.append(Spacer(1, 18 * mm))

    story.append(Paragraph("L'Exécution comme Signature :<br/>Votre Produit en Ligne Dès 14 Jours.", s_cover_title))
    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph("Comment nous concevons et développons des applications web fiables pour les fondateurs et équipes qui veulent avancer vite.", s_cover_subtitle))
    story.append(Spacer(1, 14 * mm))

    # Repères clés
    metrics_data = [
        [
            Paragraph("<b>DÈS 14J</b><br/><font color='#71717a' size='7.5'>Délai garanti</font>", s_body_bold),
            Paragraph("<b>FORFAIT FIXE</b><br/><font color='#71717a' size='7.5'>Zéro dépassement</font>", s_body_bold),
            Paragraph("<b>100% À VOUS</b><br/><font color='#71717a' size='7.5'>Cession totale GitHub</font>", s_body_bold),
            Paragraph("<b>30 JOURS</b><br/><font color='#71717a' size='7.5'>Garantie corrective</font>", s_body_bold),
        ]
    ]
    t_metrics = Table(metrics_data, colWidths=[42.5 * mm, 42.5 * mm, 42.5 * mm, 42.5 * mm])
    t_metrics.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_bg_light),
        ("BOX", (0, 0), (-1, -1), 0.5, c_border),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, c_border),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("TOPPADDING", (0, 0), (-1, -1), 3.5 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3.5 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 3 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 3 * mm),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    story.append(t_metrics)
    story.append(Spacer(1, 14 * mm))

    card_cover = Paragraph(
        "<b>L'ENGAGEMENT DE L'ATELIER :</b><br/>"
        "<font color='#e4e4e7' size='8.5'>Un modèle tellement plus direct que vous ne reviendrez jamais en arrière. Des sprints d'ingénierie au forfait scellé, exécutés avec le soin de l'artisan et livrés sans la moindre inertie commerciale.</font>",
        ParagraphStyle("CoverCardText", fontName="Helvetica", fontSize=9, leading=14, textColor=c_white)
    )
    t_cover_box = Table([[card_cover]], colWidths=[170 * mm])
    t_cover_box.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_black),
        ("ROUNDEDCORNERS", [6, 6, 6, 6]),
        ("TOPPADDING", (0, 0), (-1, -1), 5 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 6 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6 * mm),
    ]))
    story.append(t_cover_box)
    story.append(Spacer(1, 16 * mm))

    meta_footer = Paragraph(
        "<b>Édition :</b> 2026 — 2027  ·  <b>Atelier :</b> Lonside Studio  ·  <b>Direction :</b> Kevin T. (Fondateur & Lead Architecte)<br/>"
        "Document officiel d'orientation à destination des fondateurs, dirigeants et porteurs de projets.",
        ParagraphStyle("MetaFoot", fontName="Helvetica", fontSize=8, leading=12, textColor=c_gray)
    )
    story.append(meta_footer)

    # ==========================================================================
    # PAGE 2 : GENÈSE DE L'ATELIER & VISION (MUTUALISÉES)
    # ==========================================================================
    story.append(PageBreak())
    story.append(Paragraph("01 / L'ESPRIT DU STUDIO", s_chapter_tag))
    story.append(Spacer(1, 1 * mm))
    story.append(Paragraph("Genèse & Vision de l'Atelier", s_chapter_title))
    story.append(Spacer(1, 3.5 * mm))

    story.append(Paragraph(
        "Lonside est né d'un constat sans appel : lancer un produit numérique de haut niveau est devenu inutilement complexe. Trop d'intermédiaires, trop de devis à rallonge, et des semaines perdues en réunions théoriques avant de voir la moindre ébauche concrète.",
        s_body
    ))
    story.append(Spacer(1, 3 * mm))

    cartouche_p = Paragraph(
        "« Lonside a été créé avec une conviction simple : permettre aux fondateurs et aux équipes ambitieuses de déployer des produits digitaux de premier plan à la vitesse de la pensée.<br/><br/>"
        "Nous sommes un atelier indépendant de fabrication logicielle. Nous n'employons aucun commercial et nous ne sous-traitons aucun travail. Chaque plateforme est pensée, dessinée et développée directement par un Lead Architecte chevronné, dédié à un nombre strictement limité de projets à la fois. Vous travaillez avec ceux qui fabriquent. »",
        s_pullquote
    )
    t_cartouche = Table([[cartouche_p]], colWidths=[170 * mm])
    t_cartouche.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_bg_light),
        ("LINEBEFORE", (0, 0), (-1, -1), 3, c_black),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("TOPPADDING", (0, 0), (-1, -1), 3.5 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3.5 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 5 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5 * mm),
    ]))
    story.append(t_cartouche)
    story.append(Spacer(1, 4 * mm))

    story.append(Paragraph("Nos Trois Principes Inviolables", s_section_title))
    story.append(Spacer(1, 2 * mm))

    c_eng1 = [
        Paragraph("<b>1. LA PAROLE TENUE</b>", s_card_tag),
        Spacer(1, 0.5 * mm),
        Paragraph("Forfaits fermes et délais scellés dès le départ. Zéro mauvaise surprise, zéro renégociation en cours de route. Vous maîtrisez votre budget au centime près.", s_card_p)
    ]
    c_eng2 = [
        Paragraph("<b>2. CESSION TOTALE</b>", s_card_tag),
        Spacer(1, 0.5 * mm),
        Paragraph("Chaque ligne de code est livrée directement sur votre propre compte GitHub. Vous n'êtes jamais captif d'un outil propriétaire ni d'un abonnement forcé.", s_card_p)
    ]
    c_eng3 = [
        Paragraph("<b>3. LE SOIN DE L'ARTISAN</b>", s_card_tag),
        Spacer(1, 0.5 * mm),
        Paragraph("Votre produit arrive testé, fluide et prêt à encaisser des paiements réels. Notre garantie corrective de 30 jours prend le relais sans frais.", s_card_p)
    ]

    t_eng_all = Table([[c_eng1, c_eng2, c_eng3]], colWidths=[55 * mm, 55 * mm, 55 * mm])
    t_eng_all.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_bg_light),
        ("BOX", (0, 0), (-1, -1), 0.5, c_border),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, c_border),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("TOPPADDING", (0, 0), (-1, -1), 3 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 3 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 3 * mm),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(t_eng_all)

    # ==========================================================================
    # PAGE 3 : NOTRE FAÇON DE FAIRE (TIMELINE / PROCESSUS)
    # ==========================================================================
    story.append(PageBreak())
    story.append(Paragraph("02 / NOTRE FAÇON DE FAIRE", s_chapter_tag))
    story.append(Spacer(1, 1 * mm))
    story.append(Paragraph("Du Premier Échange à la Mise en Ligne", s_chapter_title))
    story.append(Spacer(1, 3.5 * mm))

    story.append(Paragraph(
        "Pas de bureaucratie, pas de flou artistique. Chaque phase poursuit un but précis, et vous testez l'avancement de votre produit en direct au fil des jours.",
        s_body
    ))
    story.append(Spacer(1, 4 * mm))

    # Étape 1 Timeline
    step1_data = [
        [Paragraph("<b>ÉTAPE 01  ·  JOURS 1 À 2</b>  —  CADRAGE, ARCHITECTURE & PRIORITÉS", s_card_tag)],
        [Paragraph("Le cahier des charges scellé et les fondations posées", s_card_h)],
        [Paragraph(
            "• Alignement chirurgical sur vos objectifs business et vos utilisateurs cibles.<br/>"
            "• Modélisation de la base de données et des parcours clés sans dispersion.<br/>"
            "• Validation conjointe du périmètre strict pour éliminer toute ambiguïté.<br/>"
            "• <b>Livrable :</b> Cahier des charges verrouillé et ouverture de votre canal direct Slack/WhatsApp.",
            s_card_p
        )]
    ]
    t_s1 = Table(step1_data, colWidths=[170 * mm])
    t_s1.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_bg_light),
        ("BOX", (0, 0), (-1, -1), 0.5, c_border),
        ("LINEBEFORE", (0, 0), (-1, -1), 3, c_black),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("TOPPADDING", (0, 0), (-1, -1), 2.5 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
    ]))
    story.append(t_s1)
    story.append(Spacer(1, 3.5 * mm))

    # Étape 2 Timeline
    step2_data = [
        [Paragraph("<b>ÉTAPE 02  ·  JOURS 3 À 11</b>  —  SPRINT D'ASSEMBLAGE & TESTS EN DIRECT", s_card_tag)],
        [Paragraph("Fabrication soignée et prévisualisation continue", s_card_h)],
        [Paragraph(
            "• Conception et développement de l'interface utilisateur et de la logique métier.<br/>"
            "• Intégration des flux de paiement (Stripe) et de vos outils indispensables.<br/>"
            "• Lien de prévisualisation actif : vous testez l'application au fil de l'eau.<br/>"
            "• <b>Livrable :</b> Version fonctionnelle complète et démo intermédiaire interactive.",
            s_card_p
        )]
    ]
    t_s2 = Table(step2_data, colWidths=[170 * mm])
    t_s2.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_bg_light),
        ("BOX", (0, 0), (-1, -1), 0.5, c_border),
        ("LINEBEFORE", (0, 0), (-1, -1), 3, c_black),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("TOPPADDING", (0, 0), (-1, -1), 2.5 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
    ]))
    story.append(t_s2)
    story.append(Spacer(1, 3.5 * mm))

    # Étape 3 Timeline
    step3_data = [
        [Paragraph("<b>ÉTAPE 03  ·  JOURS 12 À 14</b>  —  MISE EN LIGNE, TRANSMISSION & SUIVI", s_card_tag)],
        [Paragraph("Votre produit en production et assistance sereine", s_card_h)],
        [Paragraph(
            "• Vérifications finales sur mobile, audits de rapidité et sécurisation du domaine.<br/>"
            "• Transfert intégral de la propriété du code source sur votre propre compte GitHub.<br/>"
            "• Visite guidée en vidéo personnalisée (Loom) pour une totale autonomie d'équipe.<br/>"
            "• <b>Livrable :</b> Plateforme live en production + 30 jours de garantie corrective sans frais.",
            s_card_p
        )]
    ]
    t_s3 = Table(step3_data, colWidths=[170 * mm])
    t_s3.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_bg_light),
        ("BOX", (0, 0), (-1, -1), 0.5, c_border),
        ("LINEBEFORE", (0, 0), (-1, -1), 3, c_black),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("TOPPADDING", (0, 0), (-1, -1), 2.5 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
    ]))
    story.append(t_s3)

    # ==========================================================================
    # PAGE 4 : CATALOGUE DES 3 OFFRES TRANSPARENTES
    # ==========================================================================
    story.append(PageBreak())
    story.append(Paragraph("03 / NOS FORMULES TRANSPARENTES", s_chapter_tag))
    story.append(Spacer(1, 1 * mm))
    story.append(Paragraph("Des Forfaits Simples, Zéro Dépassement", s_chapter_title))
    story.append(Spacer(1, 3.5 * mm))

    story.append(Paragraph(
        "Chaque formule comprend le cadrage complet, le développement soigné, la cession du code sur votre compte et un mois d'assistance sereine.",
        s_body
    ))
    story.append(Spacer(1, 4 * mm))

    # Sprint Launch
    f_launch = [
        [Paragraph("<b>SPRINT LAUNCH</b>  ·  6 900 €  <font color='#71717a' size='7.5'>• Forfait ferme • 14 jours ouvrés</font>", s_card_tag)],
        [Paragraph("Votre première version en ligne, prête pour vos premiers clients.", s_card_h)],
        [Paragraph(
            "• Application web fluide, rapide et parfaitement adaptée aux smartphones.<br/>"
            "• Comptes utilisateurs et authentification sécurisée.<br/>"
            "• Paiements Stripe configurés (abonnements ou achats uniques).<br/>"
            "• Connexion directe avec vos outils métiers indispensables.<br/>"
            "• Cession totale du code source sur votre propre compte GitHub.<br/>"
            "• 30 jours d'assistance et garantie corrective inclus sans surcoût.",
            s_card_p
        )]
    ]
    t_fl = Table(f_launch, colWidths=[170 * mm])
    t_fl.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_bg_light),
        ("BOX", (0, 0), (-1, -1), 1, c_border),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("TOPPADDING", (0, 0), (-1, -1), 2.5 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
    ]))
    story.append(t_fl)
    story.append(Spacer(1, 3 * mm))

    # Sprint Scale
    f_scale = [
        [Paragraph("<b>SPRINT SCALE (LE PLUS RECOMMANDÉ)</b>  ·  13 900 €  <font color='#71717a' size='7.5'>• Forfait ferme • 30 jours ouvrés</font>", s_card_tag)],
        [Paragraph("Pour les plateformes multi-rôles et flux métier avancés.", s_card_h)],
        [Paragraph(
            "• <b>Tout le contenu du Sprint Launch, augmenté de :</b><br/>"
            "• Espaces multi-utilisateurs (ex: portail acheteur, vendeur, administrateur).<br/>"
            "• Calculs automatisés et traitement intelligent des données en temps réel.<br/>"
            "• Notifications automatiques et flux transactionnels sans friction.<br/>"
            "• Batterie de tests de stabilité garantissant une absorption de la montée en charge.<br/>"
            "• Visite guidée personnalisée en vidéo et documentation d'utilisation complète.",
            s_card_p
        )]
    ]
    t_fs = Table(f_scale, colWidths=[170 * mm])
    t_fs.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_bg_light),
        ("BOX", (0, 0), (-1, -1), 1.5, c_black),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("TOPPADDING", (0, 0), (-1, -1), 2.5 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
    ]))
    story.append(t_fs)
    story.append(Spacer(1, 3 * mm))

    # Régie Immersion
    f_squad = [
        [Paragraph("<b>RÉGIE D'IMMERSION</b>  ·  DÈS 5 500 € / MOIS  <font color='#71717a' size='7.5'>• Flexibilité sans engagement</font>", s_card_tag)],
        [Paragraph("Un ingénieur senior intégré directement à vos côtés.", s_card_h)],
        [Paragraph(
            "• Collaboration directe dans vos rituels et vos canaux Slack / WhatsApp.<br/>"
            "• Sortie rapide de nouvelles fonctionnalités semaine après semaine.<br/>"
            "• Semaine d'essai de 5 jours pour tester la collaboration en situation réelle.<br/>"
            "• Ajustement libre du volume chaque mois selon vos priorités réelles.",
            s_card_p
        )]
    ]
    t_fsq = Table(f_squad, colWidths=[170 * mm])
    t_fsq.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_bg_light),
        ("BOX", (0, 0), (-1, -1), 1, c_border),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("TOPPADDING", (0, 0), (-1, -1), 2.5 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
    ]))
    story.append(t_fsq)

    # ==========================================================================
    # PAGE 5 : PRODUIT 1 — BELY
    # ==========================================================================
    story.append(PageBreak())
    story.append(Paragraph("04 / ÉTUDE DE CAS #1", s_chapter_tag))
    story.append(Spacer(1, 1 * mm))
    story.append(Paragraph("Bely — Mobilité Corporate & Chauffeurs VIP", s_chapter_title))
    story.append(Spacer(1, 3 * mm))

    bely_narrative = (
        "<b>Le Contexte & Le Défi :</b> Dans l'univers du transport de prestige et de l'hôtellerie 5 étoiles, la moindre minute de retard ou erreur de facturation compromet irrémédiablement la confiance. Bely gérait son activité sur des messageries instantanées sujettes à confusion, sans visibilité cartographique pour les concierges, et subissait 40 heures de cauchemar comptable mensuel pour facturer les grands comptes.<br/><br/>"
        "<b>La Réalisation de l'Atelier :</b> Conception d'un écosystème sur-mesure unifié : moteur d'attribution de course géolocalisé en moins de 5 millisecondes, portail entreprise dédié aux conciergeries de luxe avec plafonds budgétaires et facturation mensuelle groupée automatisée.<br/><br/>"
        "<b>Résultats Concrets :</b> <b>-40h</b> de temps administratif mensuel, ponctualité exemplaire et <b>99.98%</b> de disponibilité de service."
    )
    story.append(Paragraph(bely_narrative, s_body))
    story.append(Spacer(1, 5 * mm))

    story.append(Paragraph("<b>APERÇUS DE L'INTERFACE BELY (ESPACE IMAGES CANVA)</b>", s_card_tag))
    story.append(Spacer(1, 2 * mm))

    # Emplacements Images Bely
    ph_bely_1 = create_image_placeholder(170, 75, "Bely : Tour de Contrôle & Dispatch Carte Temps Réel")
    story.append(ph_bely_1)
    story.append(Spacer(1, 3 * mm))

    ph_bely_sub1 = create_image_placeholder(83, 50, "Portail Conciergerie Hôtels")
    ph_bely_sub2 = create_image_placeholder(83, 50, "Facturation Groupée Grands Comptes")
    t_bely_sub = Table([[ph_bely_sub1, ph_bely_sub2]], colWidths=[85 * mm, 85 * mm])
    t_bely_sub.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE")]))
    story.append(t_bely_sub)

    # ==========================================================================
    # PAGE 6 : PRODUIT 2 — WELQO
    # ==========================================================================
    story.append(PageBreak())
    story.append(Paragraph("04 / ÉTUDE DE CAS #2", s_chapter_tag))
    story.append(Spacer(1, 1 * mm))
    story.append(Paragraph("Welqo — Conciergerie Immobilière Haut de Gamme", s_chapter_title))
    story.append(Spacer(1, 3 * mm))

    welqo_narrative = (
        "<b>Le Contexte & Le Défi :</b> Sur le marché de la location courte durée d'exception, les risques constants de double réservation entre plateformes (Airbnb, Booking.com) et la lenteur des contrats papier freinaient l'acquisition de nouveaux investisseurs propriétaires.<br/><br/>"
        "<b>La Réalisation de l'Atelier :</b> Déploiement d'une plateforme d'autorité associant un simulateur interactif de rentabilité financière pour convaincre les propriétaires, une synchronisation calendaire temps réel infaillible et une signature de mandat dématérialisée en 3 minutes.<br/><br/>"
        "<b>Témoignage Client :</b> <i>« Lonside a propulsé Welqo dans une autre dimension. En moins d'un mois, nous sommes passés d'un modèle artisanal à une plateforme digne des leaders mondiaux. Le simulateur signe de nouveaux propriétaires chaque semaine sans aucune friction. »</i>"
    )
    story.append(Paragraph(welqo_narrative, s_body))
    story.append(Spacer(1, 5 * mm))

    story.append(Paragraph("<b>APERÇUS DE L'INTERFACE WELQO (ESPACE IMAGES CANVA)</b>", s_card_tag))
    story.append(Spacer(1, 2 * mm))

    # Emplacements Images Welqo
    ph_welqo_1 = create_image_placeholder(170, 75, "Welqo : Simulateur Interactif de Rendement & Acquisition")
    story.append(ph_welqo_1)
    story.append(Spacer(1, 3 * mm))

    ph_welqo_sub1 = create_image_placeholder(83, 50, "Calendrier Multi-Plateformes")
    ph_welqo_sub2 = create_image_placeholder(83, 50, "Espace Personnel Propriétaires")
    t_welqo_sub = Table([[ph_welqo_sub1, ph_welqo_sub2]], colWidths=[85 * mm, 85 * mm])
    t_welqo_sub.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE")]))
    story.append(t_welqo_sub)

    # ==========================================================================
    # PAGE 7 : PRODUIT 3 — MICHI 道
    # ==========================================================================
    story.append(PageBreak())
    story.append(Paragraph("04 / ÉTUDE DE CAS #3", s_chapter_tag))
    story.append(Spacer(1, 1 * mm))
    story.append(Paragraph("Michi 道 — Intelligence Supply Chain E-commerce", s_chapter_title))
    story.append(Spacer(1, 3 * mm))

    michi_narrative = (
        "<b>Le Contexte & Le Défi :</b> Les marques e-commerce en forte accélération subissent un double gouffre financier : des ruptures de stock sur leurs produits vedettes (chiffre d'affaires envolé) et un surstockage coûteux sur les articles à rotation lente qui immobilise des dizaines de milliers d'euros de trésorerie dans les entrepôts.<br/><br/>"
        "<b>La Réalisation de l'Atelier :</b> Conception d'un tableau de bord de réassort prédictif qui analyse en temps réel les flux de vente, reconstitue la demande réelle masquée par les ruptures, et calcule la date exacte de commande auprès des fabricants en fonction des délais d'usine.<br/><br/>"
        "<b>Résultats Concrets :</b> Élimination des ruptures chroniques, protection immédiate de la trésorerie et automatisation de 10h hebdomadaires de manipulation de tableurs complexes."
    )
    story.append(Paragraph(michi_narrative, s_body))
    story.append(Spacer(1, 5 * mm))

    story.append(Paragraph("<b>APERÇUS DE L'INTERFACE MICHI (ESPACE IMAGES CANVA)</b>", s_card_tag))
    story.append(Spacer(1, 2 * mm))

    # Emplacements Images Michi
    ph_michi_1 = create_image_placeholder(170, 75, "Michi 道 : Tableau de Bord Prédictif & Analyse des Stocks")
    story.append(ph_michi_1)
    story.append(Spacer(1, 3 * mm))

    ph_michi_sub1 = create_image_placeholder(83, 50, "Calcul des Délais Fournisseurs")
    ph_michi_sub2 = create_image_placeholder(83, 50, "Analyse ABC & Rentabilité Marge")
    t_michi_sub = Table([[ph_michi_sub1, ph_michi_sub2]], colWidths=[85 * mm, 85 * mm])
    t_michi_sub.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE")]))
    story.append(t_michi_sub)

    # ==========================================================================
    # PAGE 8 : PRODUIT 4 — WEEDIN
    # ==========================================================================
    story.append(PageBreak())
    story.append(Paragraph("04 / ÉTUDE DE CAS #4", s_chapter_tag))
    story.append(Spacer(1, 1 * mm))
    story.append(Paragraph("WeedIn — Billetterie Événementielle Privée de Prestige", s_chapter_title))
    story.append(Spacer(1, 3 * mm))

    weedin_narrative = (
        "<b>Le Contexte & Le Défi :</b> L'organisation de réceptions privées réunissant des centaines de convives internationaux se heurte à des coûts colossaux de papeterie physique, un manque de visibilité sur les présences réelles (20% de gaspillage traiteur) et des risques d'intrusion lors des soirées exclusives.<br/><br/>"
        "<b>La Réalisation de l'Atelier :</b> Plateforme web sur-mesure combinant storytelling immersif, parcours RSVP fluide par cérémonie et génération instantanée d'e-billets personnalisés de prestige avec QR code d'accès infalsifiable vérifié en moins de 250 millisecondes.<br/><br/>"
        "<b>Témoignage Client :</b> <i>« Lonside a sublimé notre événement. Le QR code a permis à la sécurité de fluidifier les entrées de 600 invités sans aucune file d'attente. Le traiteur a reçu les effectifs exacts deux semaines plus tôt. Un travail d'orfèvre. »</i>"
    )
    story.append(Paragraph(weedin_narrative, s_body))
    story.append(Spacer(1, 5 * mm))

    story.append(Paragraph("<b>APERÇUS DE L'INTERFACE WEEDIN (ESPACE IMAGES CANVA)</b>", s_card_tag))
    story.append(Spacer(1, 2 * mm))

    # Emplacements Images WeedIn
    ph_weedin_1 = create_image_placeholder(170, 75, "WeedIn : Vitrine Immersive & Billetterie Digitale")
    story.append(ph_weedin_1)
    story.append(Spacer(1, 3 * mm))

    ph_weedin_sub1 = create_image_placeholder(83, 50, "Billets Personnalisés QR Code")
    ph_weedin_sub2 = create_image_placeholder(83, 50, "Galerie Collaborative Invités")
    t_weedin_sub = Table([[ph_weedin_sub1, ph_weedin_sub2]], colWidths=[85 * mm, 85 * mm])
    t_weedin_sub.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE")]))
    story.append(t_weedin_sub)

    # ==========================================================================
    # PAGE 9 : DÉMARRER ENSEMBLE (L'ÉCHANGE DE CADRAGE)
    # ==========================================================================
    story.append(PageBreak())
    story.append(Paragraph("05 / PARLONS DE VOTRE PROJET", s_chapter_tag))
    story.append(Spacer(1, 1 * mm))
    story.append(Paragraph("Démarrons Votre Prochain Produit Ensemble.", s_chapter_title))
    story.append(Spacer(1, 4 * mm))

    story.append(Paragraph(
        "Que vous ayez un cahier des charges précis ou une idée à structurer, échangeons en direct avec un Lead Architecte. Nous prenons un nombre strictement limité de projets simultanés pour garantir une attention absolue à chaque détail.",
        s_body
    ))
    story.append(Spacer(1, 5 * mm))

    # Boîte noire d'action
    contact_box_data = [
        [Paragraph("<b>ÉCHANGE DE CADRAGE (15 MINUTES)</b>", ParagraphStyle("CBoxT", fontName="Helvetica-Bold", fontSize=13, leading=17, textColor=c_white))],
        [Paragraph("<font color='#a1a1aa' size='8'>Direct avec Kevin T. (Fondateur & Lead Architecte)</font>", s_card_tag)],
        [Spacer(1, 2 * mm)],
        [Paragraph(
            "15 minutes pour évaluer la faisabilité de votre projet, définir le format idéal (Sprint Launch ou Scale) et sceller votre date cible de livraison.<br/><br/>"
            "• <b>Échange direct et sans pression commerciale</b><br/>"
            "• <b>Conseils concrets et actionnables dès le premier échange</b><br/>"
            "• <b>Chiffrage ferme immédiat sans engagement</b>",
            ParagraphStyle("CBoxBody", fontName="Helvetica", fontSize=9.5, leading=15, textColor=colors.HexColor("#e4e4e7"))
        )],
        [Spacer(1, 4 * mm)],
        [Paragraph("<b>RÉSERVEZ VOTRE CRÉNEAU :</b> contact@lonside.com", ParagraphStyle("CBoxContact", fontName="Helvetica-Bold", fontSize=11, leading=16, textColor=c_white))],
        [Paragraph("<font color='#a1a1aa' size='8'>Ou transmettez votre besoin par écrit — Réponse sous 24h ouvrées.</font>", s_card_tag)]
    ]
    t_contact_box = Table(contact_box_data, colWidths=[170 * mm])
    t_contact_box.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_black),
        ("ROUNDEDCORNERS", [6, 6, 6, 6]),
        ("TOPPADDING", (0, 0), (-1, -1), 5 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 6 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6 * mm),
    ]))
    story.append(t_contact_box)
    story.append(Spacer(1, 10 * mm))

    story.append(Paragraph(
        "<b>lonside.</b> — Atelier indépendant de conception et de développement de produits digitaux d'exception.<br/>"
        "© 2026 Lonside Studio. Forfaits fermes, délais tenus et cession totale sur votre propre compte GitHub.",
        ParagraphStyle("LegalFinal", fontName="Helvetica", fontSize=8, leading=12, textColor=c_gray, alignment=1)
    ))

    doc.build(story, canvasmaker=WhitepaperCanvas)
    print(f"Livre Blanc Lonside Studio 9 pages généré : {output_pdf}")

if __name__ == "__main__":
    os.makedirs("docs", exist_ok=True)
    os.makedirs("public", exist_ok=True)
    build_whitepaper_pdf("docs/LONSIDE_LIVRE_BLANC_COMMERCIAL.pdf")
    build_whitepaper_pdf("public/LONSIDE_LIVRE_BLANC_COMMERCIAL.pdf")
