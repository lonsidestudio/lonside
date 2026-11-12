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

        # En-tête sobre et épuré
        self.setStrokeColor(colors.HexColor("#e4e4e7"))
        self.setLineWidth(0.5)
        self.line(18 * mm, 282 * mm, 192 * mm, 282 * mm)
        self.drawString(18 * mm, 285 * mm, "LONSIDE STUDIO  //  LE GUIDE DU STUDIO")
        self.drawRightString(192 * mm, 285 * mm, "CONCEPTION & INGÉNIERIE LOGICIELLE")

        # Pied de page
        self.line(18 * mm, 14 * mm, 192 * mm, 14 * mm)
        self.drawString(18 * mm, 10 * mm, "LONSIDE STUDIO — ATELIER INDÉPENDANT D'ARTISANAT LOGICIEL")
        page_str = f"PAGE {self._pageNumber} SUR {num_pages}"
        self.drawRightString(192 * mm, 10 * mm, page_str)
        self.restoreState()

def create_image_placeholder(width_mm, height_mm, label="Capture d'Écran"):
    p = Paragraph(
        f"<font color='#a1a1aa' size='7.5'><b>[ {label.upper()} ]</b><br/>Glissez votre visuel ici</font>",
        ParagraphStyle("PlaceH", fontName="Helvetica", fontSize=7.5, leading=10, alignment=1)
    )
    t = Table([[p]], colWidths=[width_mm * mm], rowHeights=[height_mm * mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#fafafa")),
        ("BOX", (0, 0), (-1, -1), 0.6, colors.HexColor("#e4e4e7")),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
    ]))
    return t

def build_whitepaper_pdf(output_pdf):
    doc = SimpleDocTemplate(
        output_pdf,
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=20 * mm,
        bottomMargin=18 * mm,
    )

    styles = getSampleStyleSheet()

    c_black = colors.HexColor("#09090b")
    c_dark = colors.HexColor("#18181b")
    c_gray = colors.HexColor("#71717a")
    c_light_gray = colors.HexColor("#a1a1aa")
    c_bg_light = colors.HexColor("#fafafa")
    c_border = colors.HexColor("#e4e4e7")
    c_white = colors.HexColor("#ffffff")

    # Typographie
    s_cover_tag = ParagraphStyle("CoverTag", fontName="Helvetica-Bold", fontSize=9, leading=13, textColor=c_gray)
    s_cover_logo = ParagraphStyle("CoverLogo", fontName="Helvetica-Bold", fontSize=44, leading=50, textColor=c_black)
    s_cover_title = ParagraphStyle("CoverTitle", fontName="Helvetica-Bold", fontSize=26, leading=32, textColor=c_black)
    s_cover_subtitle = ParagraphStyle("CoverSubtitle", fontName="Helvetica", fontSize=12, leading=17, textColor=c_dark)

    s_chapter_tag = ParagraphStyle("ChapterTag", fontName="Helvetica-Bold", fontSize=8, leading=10, textColor=c_gray)
    s_chapter_title = ParagraphStyle("ChapterTitle", fontName="Helvetica-Bold", fontSize=18, leading=22, textColor=c_black)
    s_section_title = ParagraphStyle("SectionTitle", fontName="Helvetica-Bold", fontSize=11, leading=15, textColor=c_black)

    s_body = ParagraphStyle("BodyCustom", fontName="Helvetica", fontSize=8.5, leading=13, textColor=c_dark)
    s_body_bold = ParagraphStyle("BodyBoldCustom", fontName="Helvetica-Bold", fontSize=8.5, leading=13, textColor=c_black)
    s_pullquote = ParagraphStyle("PullQuote", fontName="Helvetica-Oblique", fontSize=9.5, leading=14.5, textColor=c_black)

    s_card_tag = ParagraphStyle("CardTag", fontName="Helvetica-Bold", fontSize=7.5, leading=9.5, textColor=c_gray)
    s_card_h = ParagraphStyle("CardH", fontName="Helvetica-Bold", fontSize=11, leading=14, textColor=c_black)
    s_card_p = ParagraphStyle("CardP", fontName="Helvetica", fontSize=8, leading=11.5, textColor=c_dark)

    story = []

    # ==========================================================================
    # PAGE 1 : COUVERTURE ALLÉGÉE, MINIMALISTE & RESPIRANTE
    # ==========================================================================
    story.append(Spacer(1, 35 * mm))
    story.append(Paragraph("LONSIDE STUDIO  //  LE GUIDE DU STUDIO", s_cover_tag))
    story.append(Spacer(1, 5 * mm))
    story.append(Paragraph("<b>lonside.</b>", s_cover_logo))
    story.append(Spacer(1, 28 * mm))

    story.append(Paragraph("L'Exécution comme Signature :<br/>Votre Produit en Ligne Dès 14 Jours.", s_cover_title))
    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph("Conception et ingénierie de plateformes web sur-mesure pour les fondateurs et dirigeants qui veulent avancer vite.", s_cover_subtitle))
    story.append(Spacer(1, 22 * mm))

    # Repères clés en grille fine et aérée (fond blanc et bordure ultra légère)
    metrics_data = [
        [
            Paragraph("<b>DÈS 14J</b><br/><font color='#71717a' size='7.5'>Délai garanti</font>", s_body_bold),
            Paragraph("<b>FORFAIT FIXE</b><br/><font color='#71717a' size='7.5'>Zéro dépassement</font>", s_body_bold),
            Paragraph("<b>100% À VOUS</b><br/><font color='#71717a' size='7.5'>Cession GitHub</font>", s_body_bold),
            Paragraph("<b>30 JOURS</b><br/><font color='#71717a' size='7.5'>Garantie corrective</font>", s_body_bold),
        ]
    ]
    t_metrics = Table(metrics_data, colWidths=[43.5 * mm, 43.5 * mm, 43.5 * mm, 43.5 * mm])
    t_metrics.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.5, c_border),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, c_border),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("TOPPADDING", (0, 0), (-1, -1), 3.5 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3.5 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 2 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 2 * mm),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    story.append(t_metrics)
    story.append(Spacer(1, 35 * mm))

    meta_footer = Paragraph(
        "<b>Édition :</b> 2026 — 2027  ·  <b>Atelier :</b> Lonside Studio  ·  <b>Direction :</b> Kevin T. (Fondateur & Lead Architecte)<br/>"
        "Document officiel d'orientation à destination des fondateurs et dirigeants.",
        ParagraphStyle("MetaFoot", fontName="Helvetica", fontSize=8, leading=12, textColor=c_gray)
    )
    story.append(meta_footer)

    # ==========================================================================
    # PAGE 2 : GENÈSE DE L'ATELIER & VISION (MUTUALISÉES EN 2 COLONNES)
    # ==========================================================================
    story.append(PageBreak())
    story.append(Paragraph("01 / L'ESPRIT DU STUDIO", s_chapter_tag))
    story.append(Spacer(1, 1 * mm))
    story.append(Paragraph("Genèse & Vision de l'Atelier", s_chapter_title))
    story.append(Spacer(1, 4 * mm))

    # Bloc d'accroche pleine largeur
    cartouche_p = Paragraph(
        "« Lonside a été créé avec une conviction simple : permettre aux fondateurs et aux équipes ambitieuses de déployer des produits digitaux de premier plan à la vitesse de la pensée.<br/><br/>"
        "Nous sommes un atelier indépendant d'ingénierie et de design logiciel. Nous n'employons aucun commercial et nous ne sous-traitons aucun travail. Chaque plateforme est pensée, dessinée et développée directement par un Lead Architecte chevronné, dédié à un nombre strictement limité de projets à la fois. Vous travaillez directement avec ceux qui fabriquent. »",
        s_pullquote
    )
    t_cartouche = Table([[cartouche_p]], colWidths=[174 * mm])
    t_cartouche.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_bg_light),
        ("LINEBEFORE", (0, 0), (-1, -1), 2.5, c_black),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("TOPPADDING", (0, 0), (-1, -1), 3.5 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3.5 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 5 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5 * mm),
    ]))
    story.append(t_cartouche)
    story.append(Spacer(1, 5 * mm))

    # Deux colonnes textuelles équilibrées
    col_g_text = [
        Paragraph("La Rupture avec l'Inertie", s_section_title),
        Spacer(1, 1.5 * mm),
        Paragraph(
            "Lancer un produit numérique demande du courage, du temps et du capital. Pourtant, l'expérience conventionnelle se transforme trop souvent en un parcours frustrant : devis imprécis, réunions de cadrage théoriques à répétition, et semaines entières perdues avant la moindre ligne de code.<br/><br/>"
            "Nous avons conçu Lonside comme un <b>antidote direct à cette lenteur</b>. En supprimant les intermédiaires, nous passons du besoin réel à la fabrication sans aucune déperdition. Vous gagnez des mois précieux sur vos concurrents.",
            s_body
        )
    ]

    col_d_text = [
        Paragraph("Nos Trois Engagements d'Atelier", s_section_title),
        Spacer(1, 1.5 * mm),
        Paragraph(
            "<b>1. La parole tenue sur les délais et le prix :</b> Forfaits fermes, sans dépassement ni renégociation en cours de route. Votre budget est maîtrisé au centime près.<br/><br/>"
            "<b>2. Cession totale sur votre compte GitHub :</b> Vous êtes propriétaire à 100% de votre code et de votre infrastructure, sans outil captif ni abonnement forcé.<br/><br/>"
            "<b>3. Le soin de l'artisan prêt pour la vraie vie :</b> Votre application arrive testée, fluide, prête à encaisser des paiements, avec 30 jours de garantie corrective sans frais.",
            s_body
        )
    ]

    t_2col_p2 = Table([[col_g_text, col_d_text]], colWidths=[84 * mm, 84 * mm])
    t_2col_p2.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("RIGHTPADDING", (0, 0), (0, 0), 3 * mm),
        ("LEFTPADDING", (1, 0), (1, 0), 3 * mm),
    ]))
    story.append(t_2col_p2)

    # ==========================================================================
    # PAGE 3 : NOTRE FAÇON DE FAIRE (TIMELINE SUR 3 COLONNES VERTICALES)
    # ==========================================================================
    story.append(PageBreak())
    story.append(Paragraph("02 / NOTRE PROCESSUS D'ATELIER", s_chapter_tag))
    story.append(Spacer(1, 1 * mm))
    story.append(Paragraph("Du Premier Échange à la Mise en Ligne", s_chapter_title))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph("Une méthodologie épurée, transparente et cadencée. Vous testez l'avancement de votre produit en direct au fil des jours.", s_body))
    story.append(Spacer(1, 5 * mm))

    # 3 Colonnes Verticales pour les 3 phases de la timeline
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

    col_w_3 = 54.5 * mm
    t_timeline_3col = Table([[c_time_1, c_time_2, c_time_3]], colWidths=[col_w_3, col_w_3, col_w_3])
    t_timeline_3col.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_bg_light),
        ("BOX", (0, 0), (-1, -1), 0.5, c_border),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, c_border),
        ("LINEABOVE", (0, 0), (-1, 0), 2.5, c_black),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("TOPPADDING", (0, 0), (-1, -1), 4 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 3.5 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 3.5 * mm),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(t_timeline_3col)

    # ==========================================================================
    # PAGE 4 : NOS FORMULES TRANSPARENTES (SUR 3 COLONNES VERTICALES)
    # ==========================================================================
    story.append(PageBreak())
    story.append(Paragraph("03 / NOS FORMULES TRANSPARENTES", s_chapter_tag))
    story.append(Spacer(1, 1 * mm))
    story.append(Paragraph("Des Forfaits Simples, Zéro Dépassement", s_chapter_title))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph("Chaque formule comprend le cadrage complet, le développement soigné, la cession du code sur votre propre compte et un mois d'assistance sereine.", s_body))
    story.append(Spacer(1, 5 * mm))

    # 3 Colonnes Verticales pour les Forfaits
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
        ("LINEABOVE", (1, 0), (1, 0), 2.5, c_black), # Mise en valeur du forfait recommandé au centre
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("TOPPADDING", (0, 0), (-1, -1), 4 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 3.5 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 3.5 * mm),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(t_pricing_3col)

    # ==========================================================================
    # PAGE 5 : PRODUIT 1 — BELY (2 COLONNES : TEXTE À GAUCHE / PHOTOS À DROITE)
    # ==========================================================================
    story.append(PageBreak())
    story.append(Paragraph("04 / ÉTUDE DE CAS #1", s_chapter_tag))
    story.append(Spacer(1, 1 * mm))
    story.append(Paragraph("Bely — Mobilité Corporate & Chauffeurs VIP", s_chapter_title))
    story.append(Spacer(1, 3.5 * mm))

    bely_col_text = [
        Paragraph("<b>L'EXIGENCE DE PONCTUALITÉ</b>", s_card_tag),
        Spacer(1, 1 * mm),
        Paragraph("La plateforme qui connecte entreprises et chauffeurs avec dispatch en direct.", s_card_h),
        Spacer(1, 2 * mm),
        Paragraph(
            "<b>Le Contexte & Le Défi :</b><br/>"
            "Dans le transport de prestige et l'hôtellerie 5 étoiles, la moindre minute de retard ou erreur de facturation compromet irrémédiablement la réputation de service. Bely opérait sur des messageries instantanées sujettes à confusion, sans suivi cartographique pour les concierges, et subissait 40 heures de cauchemar comptable mensuel pour facturer les grands comptes d'affaires.<br/><br/>"
            "<b>La Réalisation de l'Atelier :</b><br/>"
            "Conception d'un écosystème sur-mesure complet : moteur d'attribution de course géolocalisé en moins de 5 millisecondes, portail entreprise dédié aux hôtels de luxe avec plafonds budgétaires et facturation mensuelle groupée automatisée.<br/><br/>"
            "<b>Résultats Concrets :</b><br/>"
            "• <b>-40 heures</b> de temps administratif mensuel.<br/>"
            "• Calcul de dispatch en moins de <b>5 ms</b>.<br/>"
            "• <b>99.98%</b> de disponibilité de service.",
            s_body
        )
    ]

    bely_col_img = [
        create_image_placeholder(84, 85, "Bely : Dispatch Carte Temps Réel"),
        Spacer(1, 2.5 * mm),
        create_image_placeholder(84, 42, "Portail Conciergerie Hôtels"),
        Spacer(1, 2.5 * mm),
        create_image_placeholder(84, 42, "Facturation Groupée Grands Comptes"),
    ]

    t_bely_split = Table([[bely_col_text, bely_col_img]], colWidths=[84 * mm, 86 * mm])
    t_bely_split.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("RIGHTPADDING", (0, 0), (0, 0), 4 * mm),
        ("LEFTPADDING", (1, 0), (1, 0), 2 * mm),
    ]))
    story.append(t_bely_split)

    # ==========================================================================
    # PAGE 6 : PRODUIT 2 — WELQO (2 COLONNES : TEXTE À GAUCHE / PHOTOS À DROITE)
    # ==========================================================================
    story.append(PageBreak())
    story.append(Paragraph("04 / ÉTUDE DE CAS #2", s_chapter_tag))
    story.append(Spacer(1, 1 * mm))
    story.append(Paragraph("Welqo — Conciergerie Immobilière Haut de Gamme", s_chapter_title))
    story.append(Spacer(1, 3.5 * mm))

    welqo_col_text = [
        Paragraph("<b>L'AUTOMATISATION SANS ERREUR</b>", s_card_tag),
        Spacer(1, 1 * mm),
        Paragraph("Le tableau de bord qui pilote les réservations et opérations en direct.", s_card_h),
        Spacer(1, 2 * mm),
        Paragraph(
            "<b>Le Contexte & Le Défi :</b><br/>"
            "Sur le marché très concurrentiel de la location courte durée d'exception, les risques constants de double réservation entre Airbnb et Booking.com et la lenteur des contrats papier bloquaient l'acquisition de nouveaux investisseurs propriétaires.<br/><br/>"
            "<b>La Réalisation de l'Atelier :</b><br/>"
            "Déploiement d'une plateforme d'autorité associant un simulateur interactif de rentabilité financière pour convaincre les propriétaires, une synchronisation calendaire temps réel infaillible et une signature de mandat dématérialisée en 3 minutes.<br/><br/>"
            "<b>Témoignage Client :</b><br/>"
            "<i>« Lonside a propulsé Welqo dans une autre dimension. En moins d'un mois, nous sommes passés d'un modèle artisanal à une plateforme digne des leaders mondiaux. Le simulateur signe de nouveaux propriétaires chaque semaine. »</i>",
            s_body
        )
    ]

    welqo_col_img = [
        create_image_placeholder(84, 85, "Welqo : Simulateur Interactif de Rendement"),
        Spacer(1, 2.5 * mm),
        create_image_placeholder(84, 42, "Calendrier Multi-Plateformes Infaillible"),
        Spacer(1, 2.5 * mm),
        create_image_placeholder(84, 42, "Espace Personnel Propriétaires"),
    ]

    t_welqo_split = Table([[welqo_col_text, welqo_col_img]], colWidths=[84 * mm, 86 * mm])
    t_welqo_split.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("RIGHTPADDING", (0, 0), (0, 0), 4 * mm),
        ("LEFTPADDING", (1, 0), (1, 0), 2 * mm),
    ]))
    story.append(t_welqo_split)

    # ==========================================================================
    # PAGE 7 : PRODUIT 3 — MICHI 道 (2 COLONNES : TEXTE À GAUCHE / PHOTOS À DROITE)
    # ==========================================================================
    story.append(PageBreak())
    story.append(Paragraph("04 / ÉTUDE DE CAS #3", s_chapter_tag))
    story.append(Spacer(1, 1 * mm))
    story.append(Paragraph("Michi 道 — Intelligence Supply Chain E-commerce", s_chapter_title))
    story.append(Spacer(1, 3.5 * mm))

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
            "• Élimination des ruptures chroniques.<br/>"
            "• Protection directe du besoin en fonds de roulement.<br/>"
            "• Automatisation complète des recommandations d'achat.",
            s_body
        )
    ]

    michi_col_img = [
        create_image_placeholder(84, 85, "Michi 道 : Tableau de Bord Prédictif des Ventes"),
        Spacer(1, 2.5 * mm),
        create_image_placeholder(84, 42, "Calcul des Délais Fournisseurs"),
        Spacer(1, 2.5 * mm),
        create_image_placeholder(84, 42, "Analyse ABC & Rentabilité Marge"),
    ]

    t_michi_split = Table([[michi_col_text, michi_col_img]], colWidths=[84 * mm, 86 * mm])
    t_michi_split.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("RIGHTPADDING", (0, 0), (0, 0), 4 * mm),
        ("LEFTPADDING", (1, 0), (1, 0), 2 * mm),
    ]))
    story.append(t_michi_split)

    # ==========================================================================
    # PAGE 8 : PRODUIT 4 — WEEDIN (2 COLONNES : TEXTE À GAUCHE / PHOTOS À DROITE)
    # ==========================================================================
    story.append(PageBreak())
    story.append(Paragraph("04 / ÉTUDE DE CAS #4", s_chapter_tag))
    story.append(Spacer(1, 1 * mm))
    story.append(Paragraph("WeedIn — Billetterie Événementielle Privée de Prestige", s_chapter_title))
    story.append(Spacer(1, 3.5 * mm))

    weedin_col_text = [
        Paragraph("<b>L'EXPÉRIENCE INVITÉS IMMERSIVE</b>", s_card_tag),
        Spacer(1, 1 * mm),
        Paragraph("L'application qui simplifie la réservation et la billetterie d'événements.", s_card_h),
        Spacer(1, 2 * mm),
        Paragraph(
            "<b>Le Contexte & Le Défi :</b><br/>"
            "L'organisation d'événements privés de grand prestige réunissant des centaines d'invités internationaux se heurte à des coûts colossaux de papeterie papier, un manque de visibilité sur les présences réelles (20% à 30% de gaspillage traiteur) et des risques d'intrusion lors des réceptions exclusives.<br/><br/>"
            "<b>La Réalisation de l'Atelier :</b><br/>"
            "Création d'une plateforme web sur-mesure associant vitrine immersive, parcours RSVP fluide par cérémonie et génération d'e-billets personnalisés avec QR code vérifié à l'accueil en 250 ms.<br/><br/>"
            "<b>Témoignage Client :</b><br/>"
            "<i>« Lonside a sublimé notre événement. Le QR code a permis à l'équipe de sécurité de fluidifier les entrées de 600 invités sans aucune file d'attente. Le traiteur a reçu les effectifs exacts deux semaines plus tôt. Un travail d'orfèvre. »</i>",
            s_body
        )
    ]

    weedin_col_img = [
        create_image_placeholder(84, 85, "WeedIn : Vitrine Immersive Événementielle"),
        Spacer(1, 2.5 * mm),
        create_image_placeholder(84, 42, "Billets Personnalisés QR Code Sécurisé"),
        Spacer(1, 2.5 * mm),
        create_image_placeholder(84, 42, "Galerie Collaborative Invités en Direct"),
    ]

    t_weedin_split = Table([[weedin_col_text, weedin_col_img]], colWidths=[84 * mm, 86 * mm])
    t_weedin_split.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("RIGHTPADDING", (0, 0), (0, 0), 4 * mm),
        ("LEFTPADDING", (1, 0), (1, 0), 2 * mm),
    ]))
    story.append(t_weedin_split)

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
    story.append(Spacer(1, 6 * mm))

    # Boîte noire d'action élégante
    contact_box_data = [
        [Paragraph("<b>ÉCHANGE DE CADRAGE (15 MINUTES)</b>", ParagraphStyle("CBoxT", fontName="Helvetica-Bold", fontSize=13, leading=17, textColor=c_white))],
        [Paragraph("<font color='#a1a1aa' size='8'>Direct avec Kevin T. (Fondateur & Lead Architecte)</font>", s_card_tag)],
        [Spacer(1, 2 * mm)],
        [Paragraph(
            "15 minutes pour évaluer la faisabilité de votre projet, définir le format idéal (Sprint Launch ou Scale) et sceller votre date cible de livraison.<br/><br/>"
            "• <b>Échange direct et sans pression commerciale</b><br/>"
            "• <b>Conseils concrets et actionnables dès le premier échange</b><br/>"
            "• <b>Chiffrage ferme immédiat sans engagement</b>",
            ParagraphStyle("CBoxBody", fontName="Helvetica", fontSize=9, leading=14.5, textColor=colors.HexColor("#e4e4e7"))
        )],
        [Spacer(1, 4 * mm)],
        [Paragraph("<b>RÉSERVEZ VOTRE CRÉNEAU :</b> contact@lonside.com", ParagraphStyle("CBoxContact", fontName="Helvetica-Bold", fontSize=11, leading=16, textColor=c_white))],
        [Paragraph("<font color='#a1a1aa' size='8'>Ou transmettez votre besoin par écrit — Réponse sous 24h ouvrées.</font>", s_card_tag)]
    ]
    t_contact_box = Table(contact_box_data, colWidths=[174 * mm])
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
    print(f"Livre Blanc Portrait Multi-Colonnes généré : {output_pdf}")

if __name__ == "__main__":
    os.makedirs("docs", exist_ok=True)
    os.makedirs("public", exist_ok=True)
    build_whitepaper_pdf("docs/LONSIDE_LIVRE_BLANC_COMMERCIAL.pdf")
    build_whitepaper_pdf("public/LONSIDE_LIVRE_BLANC_COMMERCIAL.pdf")
