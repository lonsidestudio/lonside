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

        # En-tête
        self.setStrokeColor(colors.HexColor("#e4e4e7"))
        self.setLineWidth(0.5)
        self.line(20 * mm, 282 * mm, 190 * mm, 282 * mm)
        self.drawString(20 * mm, 285 * mm, "LONSIDE STUDIO  //  LE GUIDE DU STUDIO")
        self.drawRightString(190 * mm, 285 * mm, "CONCEPTION & DÉVELOPPEMENT DE PRODUITS DIGITAUX")

        # Pied de page
        self.line(20 * mm, 15 * mm, 190 * mm, 15 * mm)
        self.drawString(20 * mm, 10 * mm, "LONSIDE STUDIO — ATELIER D'ARTISANAT LOGICIEL & INGÉNIERIE SUR-MESURE")
        page_str = f"PAGE {self._pageNumber} SUR {num_pages}"
        self.drawRightString(190 * mm, 10 * mm, page_str)
        self.restoreState()

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

    # Palette monochrome haute couture Lonside
    c_black = colors.HexColor("#09090b")
    c_dark = colors.HexColor("#18181b")
    c_gray = colors.HexColor("#71717a")
    c_light_gray = colors.HexColor("#a1a1aa")
    c_bg_light = colors.HexColor("#fafafa")
    c_border = colors.HexColor("#e4e4e7")
    c_white = colors.HexColor("#ffffff")

    # Typographie
    s_cover_tag = ParagraphStyle(
        "CoverTag",
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=14,
        textColor=c_gray,
    )

    s_cover_logo = ParagraphStyle(
        "CoverLogo",
        fontName="Helvetica-Bold",
        fontSize=38,
        leading=44,
        textColor=c_black,
    )

    s_cover_title = ParagraphStyle(
        "CoverTitle",
        fontName="Helvetica-Bold",
        fontSize=26,
        leading=32,
        textColor=c_black,
    )

    s_cover_subtitle = ParagraphStyle(
        "CoverSubtitle",
        fontName="Helvetica",
        fontSize=13,
        leading=19,
        textColor=c_dark,
    )

    s_chapter_tag = ParagraphStyle(
        "ChapterTag",
        fontName="Helvetica-Bold",
        fontSize=9,
        leading=12,
        textColor=c_gray,
    )

    s_chapter_title = ParagraphStyle(
        "ChapterTitle",
        fontName="Helvetica-Bold",
        fontSize=20,
        leading=25,
        textColor=c_black,
    )

    s_section_title = ParagraphStyle(
        "SectionTitle",
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=17,
        textColor=c_black,
    )

    s_body = ParagraphStyle(
        "BodyCustom",
        fontName="Helvetica",
        fontSize=9.5,
        leading=15,
        textColor=c_dark,
    )

    s_body_bold = ParagraphStyle(
        "BodyBoldCustom",
        fontName="Helvetica-Bold",
        fontSize=9.5,
        leading=15,
        textColor=c_black,
    )

    s_pullquote = ParagraphStyle(
        "PullQuote",
        fontName="Helvetica-Oblique",
        fontSize=11,
        leading=16,
        textColor=c_black,
    )

    s_card_tag = ParagraphStyle(
        "CardTag",
        fontName="Helvetica-Bold",
        fontSize=8.5,
        leading=11,
        textColor=c_gray,
    )

    s_card_h = ParagraphStyle(
        "CardH",
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=17,
        textColor=c_black,
    )

    s_card_p = ParagraphStyle(
        "CardP",
        fontName="Helvetica",
        fontSize=9,
        leading=14,
        textColor=c_dark,
    )

    story = []

    # ==========================================================================
    # PAGE 1 : COUVERTURE DU LIVRE BLANC
    # ==========================================================================
    story.append(Spacer(1, 15 * mm))
    story.append(Paragraph("LONSIDE STUDIO  //  LE GUIDE DU STUDIO", s_cover_tag))
    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph("<b>lonside.</b>", s_cover_logo))
    story.append(Spacer(1, 18 * mm))

    story.append(Paragraph("Votre produit digital en production,<br/>dès 14 jours.", s_cover_title))
    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph("Nous concevons et développons des applications web et plateformes fiables pour les fondateurs et équipes qui veulent avancer vite.", s_cover_subtitle))
    story.append(Spacer(1, 14 * mm))

    # Tableau des 4 repères clés (visibles au premier coup d'œil)
    metrics_data = [
        [
            Paragraph("<b>DÈS 14J</b><br/><font color='#71717a' size='8'>Délai garanti</font>", s_body_bold),
            Paragraph("<b>FORFAIT FIXE</b><br/><font color='#71717a' size='8'>Zéro dépassement</font>", s_body_bold),
            Paragraph("<b>100% À VOUS</b><br/><font color='#71717a' size='8'>Cession totale GitHub</font>", s_body_bold),
            Paragraph("<b>30 JOURS</b><br/><font color='#71717a' size='8'>Garantie corrective</font>", s_body_bold),
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

    # Carte noire de promesse
    card_manifesto_cover = Paragraph(
        "<b>L'ENGAGEMENT LONSIDE :</b><br/>"
        "<font color='#e4e4e7' size='9'>Un modèle tellement plus direct que vous ne reviendrez jamais en arrière. Des sprints d'ingénierie au forfait scellé, exécutés avec le soin de l'artisan et livrés sans inertie.</font>",
        ParagraphStyle("CoverCardText", fontName="Helvetica", fontSize=9.5, leading=14.5, textColor=c_white)
    )
    t_cover_box = Table([[card_manifesto_cover]], colWidths=[170 * mm])
    t_cover_box.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_black),
        ("ROUNDEDCORNERS", [6, 6, 6, 6]),
        ("TOPPADDING", (0, 0), (-1, -1), 5 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 6 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6 * mm),
    ]))
    story.append(t_cover_box)
    story.append(Spacer(1, 18 * mm))

    meta_footer = Paragraph(
        "<b>Édition :</b> 2026 — 2027  ·  <b>Atelier :</b> Lonside Studio  ·  <b>Direction :</b> Kevin T. (Fondateur & Lead Architecte)<br/>"
        "Document d'orientation destiné aux fondateurs, dirigeants et porteurs de projets ambitieux.",
        ParagraphStyle("MetaFoot", fontName="Helvetica", fontSize=8, leading=12, textColor=c_gray)
    )
    story.append(meta_footer)

    # ==========================================================================
    # PAGE 2 : POURQUOI LONSIDE A ÉTÉ CRÉÉ
    # ==========================================================================
    story.append(PageBreak())
    story.append(Paragraph("01 / LA GENÈSE DE L'ATELIER", s_chapter_tag))
    story.append(Spacer(1, 1 * mm))
    story.append(Paragraph("Pourquoi Lonside a été Créé", s_chapter_title))
    story.append(Spacer(1, 4 * mm))

    story.append(Paragraph(
        "Lancer un nouveau produit demande du courage, du temps et de l'énergie. Travailler avec nous doit être une expérience stimulante et limpide, pas un tunnel anxiogène de devis flous, d'intermédiaires commerciaux et de retards répétés.",
        s_body
    ))
    story.append(Spacer(1, 4 * mm))

    # Grande citation cartouche
    cartouche_p = Paragraph(
        "« Lonside a été créé avec une conviction simple : permettre aux fondateurs et aux équipes ambitieuses de déployer des produits digitaux de premier plan à la vitesse de la pensée.<br/><br/>"
        "Chez Lonside, nous ne sommes pas une structure conventionnelle : <b>nous sommes un studio de fabrication logicielle et d'artisanat numérique</b>. Nous n'employons aucun commercial et nous ne sous-traitons aucun travail. Chaque plateforme est conçue, architecturée et développée directement par un Lead Architecte chevronné, dédié à un nombre strictement limité de clients à la fois. »",
        s_pullquote
    )
    t_cartouche = Table([[cartouche_p]], colWidths=[170 * mm])
    t_cartouche.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_bg_light),
        ("LINEBEFORE", (0, 0), (-1, -1), 3, c_black),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("TOPPADDING", (0, 0), (-1, -1), 4 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 6 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6 * mm),
    ]))
    story.append(t_cartouche)
    story.append(Spacer(1, 5 * mm))

    story.append(Paragraph("La Rupture avec les Processus Conventionnels", s_section_title))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(
        "Dans la plupart des expériences de développement externes, les clients vivent le même schéma frustrant : des réunions préparatoires interminables, des cahiers des charges qui enflent sans fin, et une mise en ligne sans cesse reportée.<br/><br/>"
        "Nous avons conçu Lonside comme un <b>antidote à cette inertie</b> :<br/>"
        "• <b>Zéro intermédiaire :</b> Vous parlez directement à la personne qui construit votre produit.<br/>"
        "• <b>Des forfaits fermes scellés au départ :</b> Aucune facture de complaisance, aucune renégociation en cours de route.<br/>"
        "• <b>L'essentiel d'abord :</b> Nous focalisons chaque sprint sur les fonctionnalités qui génèrent de la valeur réelle et valident votre marché.",
        s_body
    ))

    # ==========================================================================
    # PAGE 3 : NOS TROIS ENGAGEMENTS D'ATELIER
    # ==========================================================================
    story.append(PageBreak())
    story.append(Paragraph("02 / NOTRE VISION D'ATELIER", s_chapter_tag))
    story.append(Spacer(1, 1 * mm))
    story.append(Paragraph("Créer du Logiciel, dans la Confiance.", s_chapter_title))
    story.append(Spacer(1, 4 * mm))

    story.append(Paragraph(
        "Notre collaboration repose sur trois principes immuables. Ils garantissent que chaque euro investi produit un résultat mesurable et pérenne.",
        s_body
    ))
    story.append(Spacer(1, 5 * mm))

    # Engagement 1
    eng1_data = [
        [Paragraph("<b>ENGAGEMENT #01</b>  ·  FORFAIT FERME & ZÉRO SURCOÛT SURPRISE", s_card_tag)],
        [Paragraph("La parole tenue sur les délais et le prix", s_card_h)],
        [Paragraph("Avant de poser la première ligne de code, nous cadrons ensemble ce qui compte réellement pour votre entreprise. Une fois le périmètre validé, notre engagement est total : le prix ne bouge pas d'un centime, et la date de livraison est scellée. Vous savez exactement où vous allez.", s_card_p)]
    ]
    t_eng1 = Table(eng1_data, colWidths=[170 * mm])
    t_eng1.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_bg_light),
        ("BOX", (0, 0), (-1, -1), 0.5, c_border),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("TOPPADDING", (0, 0), (-1, -1), 3 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
    ]))
    story.append(t_eng1)
    story.append(Spacer(1, 4 * mm))

    # Engagement 2
    eng2_data = [
        [Paragraph("<b>ENGAGEMENT #02</b>  ·  VOTRE COMPTE GITHUB & CESSION TOTALE", s_card_tag)],
        [Paragraph("Un code 100% à vous, sans aucune captivité", s_card_h)],
        [Paragraph("Chaque ligne de code, chaque schéma de base de données et chaque composant d'interface sont poussés directement sur votre propre compte GitHub. Vous n'êtes jamais captif d'un outil propriétaire ni d'un abonnement forcé. Vous restez libre de grandir avec nous ou en totale autonomie.", s_card_p)]
    ]
    t_eng2 = Table(eng2_data, colWidths=[170 * mm])
    t_eng2.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_bg_light),
        ("BOX", (0, 0), (-1, -1), 0.5, c_border),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("TOPPADDING", (0, 0), (-1, -1), 3 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
    ]))
    story.append(t_eng2)
    story.append(Spacer(1, 4 * mm))

    # Engagement 3
    eng3_data = [
        [Paragraph("<b>ENGAGEMENT #03</b>  ·  TESTS RIGOUREUX & GARANTIE 30 JOURS", s_card_tag)],
        [Paragraph("Le soin de l'artisan, prêt pour la vraie vie", s_card_h)],
        [Paragraph("Nous aimons sincèrement ce que nous fabriquons. Votre application n'est pas une maquette bancale : elle arrive testée, fluide, documentée, prête à accueillir de vrais utilisateurs et à encaisser des paiements. Et si le moindre ajustement est nécessaire, notre garantie 30 jours prend le relais sans frais.", s_card_p)]
    ]
    t_eng3 = Table(eng3_data, colWidths=[170 * mm])
    t_eng3.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_bg_light),
        ("BOX", (0, 0), (-1, -1), 0.5, c_border),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("TOPPADDING", (0, 0), (-1, -1), 3 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
    ]))
    story.append(t_eng3)

    # ==========================================================================
    # PAGE 4 : CATALOGUE DES 3 OFFRES & TARIFS CLAIRS
    # ==========================================================================
    story.append(PageBreak())
    story.append(Paragraph("03 / NOS FORFAITS TRANSPARENTS", s_chapter_tag))
    story.append(Spacer(1, 1 * mm))
    story.append(Paragraph("Des Formules Simples, Zéro Mauvaise Surprise", s_chapter_title))
    story.append(Spacer(1, 4 * mm))

    story.append(Paragraph(
        "Chaque formule comprend le cadrage complet, le développement soigné, la cession du code sur votre propre compte et un mois d'assistance sereine.",
        s_body
    ))
    story.append(Spacer(1, 4 * mm))

    # Offre 1 : Sprint Launch
    o1_box = [
        [Paragraph("<b>SPRINT LAUNCH</b>  ·  6 900 €  <font color='#71717a' size='8'>(Forfait ferme • 14 jours ouvrés)</font>", s_card_tag)],
        [Paragraph("Votre première version en ligne, prête pour vos premiers clients.", s_card_h)],
        [Paragraph(
            "• Application web fluide, rapide et responsive sur mobile<br/>"
            "• Comptes utilisateurs et authentification sécurisée<br/>"
            "• Paiements Stripe configurés (abonnements ou achats uniques)<br/>"
            "• Connexion avec vos outils métiers et services essentiels<br/>"
            "• Code 100% à vous sur votre propre compte GitHub<br/>"
            "• 30 jours d'assistance et garantie corrective inclus",
            s_card_p
        )]
    ]
    t_o1 = Table(o1_box, colWidths=[170 * mm])
    t_o1.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_bg_light),
        ("BOX", (0, 0), (-1, -1), 1, c_border),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("TOPPADDING", (0, 0), (-1, -1), 2.5 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
    ]))
    story.append(t_o1)
    story.append(Spacer(1, 3.5 * mm))

    # Offre 2 : Sprint Scale (Recommandé)
    o2_box = [
        [Paragraph("<b>SPRINT SCALE (RECOMMANDÉ)</b>  ·  13 900 €  <font color='#71717a' size='8'>(Forfait ferme • 30 jours ouvrés)</font>", s_card_tag)],
        [Paragraph("Pour les plateformes multi-rôles et flux métier avancés.", s_card_h)],
        [Paragraph(
            "• <b>Tout le contenu du Sprint Launch, augmenté de :</b><br/>"
            "• Espaces multi-rôles (ex: acheteur, vendeur, administrateur)<br/>"
            "• Calculs automatisés et traitement intelligent des données<br/>"
            "• Notifications en temps réel et flux d'automatisation<br/>"
            "• Tests rigoureux pour garantir une stabilité irréprochable<br/>"
            "• Visite guidée personnalisée en vidéo et documentation complète",
            s_card_p
        )]
    ]
    t_o2 = Table(o2_box, colWidths=[170 * mm])
    t_o2.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_bg_light),
        ("BOX", (0, 0), (-1, -1), 1.5, c_black),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("TOPPADDING", (0, 0), (-1, -1), 2.5 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
    ]))
    story.append(t_o2)
    story.append(Spacer(1, 3.5 * mm))

    # Offre 3 : Régie d'Immersion
    o3_box = [
        [Paragraph("<b>RÉGIE D'IMMERSION</b>  ·  DÈS 5 500 € / MOIS  <font color='#71717a' size='8'>(Flexibilité sans engagement)</font>", s_card_tag)],
        [Paragraph("Un ingénieur senior intégré directement à vos côtés.", s_card_h)],
        [Paragraph(
            "• Ingénieur senior dédié (1 à 3 profils selon vos besoins)<br/>"
            "• Collaboration directe dans votre Slack et vos rituels de travail<br/>"
            "• Sortie rapide de nouvelles fonctionnalités au quotidien<br/>"
            "• Semaine d'essai de 5 jours pour tester la collaboration<br/>"
            "• Ajustement libre du volume chaque mois selon vos priorités",
            s_card_p
        )]
    ]
    t_o3 = Table(o3_box, colWidths=[170 * mm])
    t_o3.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_bg_light),
        ("BOX", (0, 0), (-1, -1), 1, c_border),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("TOPPADDING", (0, 0), (-1, -1), 2.5 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
    ]))
    story.append(t_o3)

    # ==========================================================================
    # PAGE 5 : NOS RÉALISATIONS RÉELLES (LES 4 PRODUITS DU STUDIO)
    # ==========================================================================
    story.append(PageBreak())
    story.append(Paragraph("04 / NOS RÉALISATIONS CHOISIES", s_chapter_tag))
    story.append(Spacer(1, 1 * mm))
    story.append(Paragraph("Des Produits Bien Conçus, Faits pour Durer.", s_chapter_title))
    story.append(Spacer(1, 3 * mm))

    story.append(Paragraph(
        "Voici quelques applications que nous avons façonnées aux côtés de leurs fondateurs. De la première maquette jusqu'au lancement officiel, chaque projet résout un vrai besoin métier avec soin et clarté.",
        s_body
    ))
    story.append(Spacer(1, 3 * mm))

    # Cas 1 : Bely
    cas_bely = [
        [Paragraph("<b>BELY</b>  ·  MOBILITÉ CORPORATE & TRANSPORT VTC HAUT DE GAMME", s_card_tag)],
        [Paragraph("La plateforme qui connecte entreprises et chauffeurs avec dispatch en direct.", s_card_h)],
        [Paragraph(
            "• <b>Le défi :</b> Supprimer le dispatch artisanal par messagerie et 40h de réconciliation comptable mensuelle pour les grands comptes d'hôtellerie 5 étoiles.<br/>"
            "• <b>La solution :</b> Moteur de dispatch instantané en moins de 5 millisecondes, portail corporate pour les conciergeries et facturation mensuelle groupée automatisée.<br/>"
            "• <b>Impact réel :</b> 40 heures de gestion administrative économisées par mois et 99.98% de disponibilité de service.",
            s_card_p
        )]
    ]
    t_bely = Table(cas_bely, colWidths=[170 * mm])
    t_bely.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_bg_light),
        ("BOX", (0, 0), (-1, -1), 0.5, c_border),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("TOPPADDING", (0, 0), (-1, -1), 2 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
    ]))
    story.append(t_bely)
    story.append(Spacer(1, 2.5 * mm))

    # Cas 2 : Welqo
    cas_welqo = [
        [Paragraph("<b>WELQO</b>  ·  PROPTECH & CONCIERGERIE HAUT DE GAMME", s_card_tag)],
        [Paragraph("Le tableau de bord qui pilote les réservations et opérations en direct.", s_card_h)],
        [Paragraph(
            "• <b>Le défi :</b> Éliminer tout risque de double réservation entre Airbnb et Booking.com, et convaincre les propriétaires de signer des mandats de gestion.<br/>"
            "• <b>La solution :</b> Simulateur interactif de rentabilité financière pour les investisseurs, synchronisation calendaire sans latence et signature de mandat en ligne en 3 minutes.<br/>"
            "• <b>Témoignage :</b> <i>« En moins d'un mois, nous sommes passés d'un modèle artisanal à une plateforme digne des leaders mondiaux. Le simulateur signe de nouveaux propriétaires chaque semaine. »</i>",
            s_card_p
        )]
    ]
    t_welqo = Table(cas_welqo, colWidths=[170 * mm])
    t_welqo.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_bg_light),
        ("BOX", (0, 0), (-1, -1), 0.5, c_border),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("TOPPADDING", (0, 0), (-1, -1), 2 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
    ]))
    story.append(t_welqo)
    story.append(Spacer(1, 2.5 * mm))

    # Cas 3 : Michi 道
    cas_michi = [
        [Paragraph("<b>MICHI 道</b>  ·  E-COMMERCE & INTELLIGENCE SUPPLY CHAIN", s_card_tag)],
        [Paragraph("L'outil prédictif qui évite les ruptures de stock sans bloquer de trésorerie.", s_card_h)],
        [Paragraph(
            "• <b>Le défi :</b> Éviter les ruptures de stock récurrentes sur les produits vedettes et le surstockage coûteux sur les articles à rotation lente.<br/>"
            "• <b>La solution :</b> Moteur de calcul prédictif intégrant les délais fournisseurs réels (30 à 90 jours) et neutralisant les anomalies de vente ponctuelles.<br/>"
            "• <b>Impact réel :</b> Protection directe du besoin en fonds de roulement et passage de commandes fournisseurs optimisé.",
            s_card_p
        )]
    ]
    t_michi = Table(cas_michi, colWidths=[170 * mm])
    t_michi.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_bg_light),
        ("BOX", (0, 0), (-1, -1), 0.5, c_border),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("TOPPADDING", (0, 0), (-1, -1), 2 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
    ]))
    story.append(t_michi)
    story.append(Spacer(1, 2.5 * mm))

    # Cas 4 : WeedIn
    cas_weedin = [
        [Paragraph("<b>WEEDIN</b>  ·  EVENTTECH & EXPÉRIENCE DIGITALE HAUT DE GAMME", s_card_tag)],
        [Paragraph("L'application qui simplifie la réservation et la billetterie d'événements privés.", s_card_h)],
        [Paragraph(
            "• <b>Le défi :</b> Supprimer la papeterie papier internationale coûteuse et fluidifier l'accueil sécurisé de 600 invités sans file d'attente.<br/>"
            "• <b>La solution :</b> Vitrine interactive élégante, confirmations RSVP par cérémonie et génération de billets électroniques infalsifiables avec QR code vérifié en 250 ms.<br/>"
            "• <b>Témoignage :</b> <i>« Lonside a sublimé notre événement. Le traiteur a reçu les effectifs exacts deux semaines plus tôt, et nous avons collecté 600 photos de nos proches. Un travail d'orfèvre. »</i>",
            s_card_p
        )]
    ]
    t_weedin = Table(cas_weedin, colWidths=[170 * mm])
    t_weedin.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_bg_light),
        ("BOX", (0, 0), (-1, -1), 0.5, c_border),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("TOPPADDING", (0, 0), (-1, -1), 2 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
    ]))
    story.append(t_weedin)

    # ==========================================================================
    # PAGE 6 : DÉMARRONS VOTRE PROCHAIN PRODUIT ENSEMBLE
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
        "<b>lonside.</b> — Atelier de conception et de développement de produits digitaux d'exception.<br/>"
        "© 2026 Lonside Studio. Forfaits fermes, délais tenus et cession totale sur votre propre compte GitHub.",
        ParagraphStyle("LegalFinal", fontName="Helvetica", fontSize=8, leading=12, textColor=c_gray, alignment=1)
    ))

    doc.build(story, canvasmaker=WhitepaperCanvas)
    print(f"Livre Blanc Lonside Studio généré avec succès : {output_pdf}")

if __name__ == "__main__":
    os.makedirs("docs", exist_ok=True)
    os.makedirs("public", exist_ok=True)
    build_whitepaper_pdf("docs/LONSIDE_LIVRE_BLANC_COMMERCIAL.pdf")
    build_whitepaper_pdf("public/LONSIDE_LIVRE_BLANC_COMMERCIAL.pdf")
