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
    KeepTogether,
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
        # On ne met pas de header/footer sur la couverture (page 1)
        if self._pageNumber == 1:
            return

        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#71717a"))

        # En-tête
        self.setStrokeColor(colors.HexColor("#e4e4e7"))
        self.setLineWidth(0.5)
        self.line(20 * mm, 282 * mm, 190 * mm, 282 * mm)
        self.drawString(20 * mm, 285 * mm, "LONSIDE  //  LIVRE BLANC STRATÉGIQUE & GUIDE D'EXÉCUTION")
        self.drawRightString(190 * mm, 285 * mm, "L'ART DE L'EXÉCUTION DIGITALE")

        # Pied de page
        self.line(20 * mm, 15 * mm, 190 * mm, 15 * mm)
        self.drawString(20 * mm, 10 * mm, "LONSIDE — CONCEPTION & DÉVELOPPEMENT DE PRODUITS NUMÉRIQUES D'EXCEPTION")
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

    # Couleurs de la DA Lonside
    c_black = colors.HexColor("#09090b")
    c_dark = colors.HexColor("#18181b")
    c_gray = colors.HexColor("#71717a")
    c_light_gray = colors.HexColor("#a1a1aa")
    c_bg_light = colors.HexColor("#fafafa")
    c_border = colors.HexColor("#e4e4e7")
    c_white = colors.HexColor("#ffffff")

    # Styles Typographiques Haute Précision
    s_cover_tag = ParagraphStyle(
        "CoverTag",
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=14,
        textColor=c_gray,
        alignment=0,
    )

    s_cover_logo = ParagraphStyle(
        "CoverLogo",
        fontName="Helvetica-Bold",
        fontSize=36,
        leading=42,
        textColor=c_black,
    )

    s_cover_title = ParagraphStyle(
        "CoverTitle",
        fontName="Helvetica-Bold",
        fontSize=28,
        leading=34,
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
        "BodyTextCustom",
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
        fontSize=12,
        leading=17,
        textColor=c_black,
        alignment=0,
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
        fontSize=14,
        leading=18,
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
    # PAGE 1 : COUVERTURE ÉDITORIALE HAUTE COUTURE
    # ==========================================================================
    story.append(Spacer(1, 15 * mm))
    story.append(Paragraph("LONSIDE  //  LIVRE BLANC EXÉCUTIF", s_cover_tag))
    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph("<b>lonside.</b>", s_cover_logo))
    story.append(Spacer(1, 20 * mm))

    story.append(Paragraph("L'Art de l'Exécution Digitale", s_cover_title))
    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph("Comment les entreprises ambitieuses transforment leur vision en produits numériques rentables, sans lenteur ni compromis.", s_cover_subtitle))
    story.append(Spacer(1, 15 * mm))

    # Badge encadré noir sur couverture
    badge_cover = Paragraph(
        "<b>LE GUIDE STRATÉGIQUE DES DÉCIDEURS</b><br/>"
        "<font color='#a1a1aa' size='8'>De la conception à la conquête de marché : méthode, offres d'intervention et retours sur investissement.</font>",
        ParagraphStyle("CoverBadgeP", fontName="Helvetica", fontSize=9, leading=14, textColor=c_white)
    )
    b_table = Table([[badge_cover]], colWidths=[170 * mm])
    b_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_black),
        ("ROUNDEDCORNERS", [6, 6, 6, 6]),
        ("TOPPADDING", (0, 0), (-1, -1), 6 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 6 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6 * mm),
    ]))
    story.append(b_table)

    story.append(Spacer(1, 25 * mm))

    cover_meta = Paragraph(
        "<b>Édition :</b> 2026 — 2027<br/>"
        "<b>Auteur :</b> Lonside Studio — Équipe de Direction Produit & Partenariats<br/>"
        "<b>Destinataires :</b> Fondateurs, Directeurs Généraux, Directeurs Marketing & Responsables Produit",
        ParagraphStyle("CoverMeta", fontName="Helvetica", fontSize=8.5, leading=13, textColor=c_gray)
    )
    story.append(cover_meta)

    # ==========================================================================
    # PAGE 2 : CHAPITRE 1 — LE PARADOXE DU DIGITAL
    # ==========================================================================
    story.append(PageBreak())
    story.append(Paragraph("01 / DIAGNOSTIC DU MARCHÉ", s_chapter_tag))
    story.append(Spacer(1, 1 * mm))
    story.append(Paragraph("Le Coût Invisible de la Médiocrité", s_chapter_title))
    story.append(Spacer(1, 4 * mm))

    story.append(Paragraph(
        "Dans l'économie moderne, votre produit digital n'est pas une simple vitrine : <b>c'est le cœur battant de votre entreprise</b>. C'est le premier point de contact où un client décide, en moins de 3 secondes, de vous faire confiance ou de partir chez un concurrent.<br/><br/>"
        "Pourtant, la majorité des projets de refonte ou de création digitale échouent à générer le moindre impact commercial quantifiable.",
        s_body
    ))
    story.append(Spacer(1, 4 * mm))

    # Pull quote
    quote_box = Table([[Paragraph(
        "« 70% des projets digitaux n'atteignent jamais leurs objectifs de rentabilité. Non pas par manque d'idées, mais à cause d'une exécution lente, diluée par les réunions inutiles et polluée par des compromis esthétiques dévastateurs. »",
        s_pullquote
    )]], colWidths=[170 * mm])
    quote_box.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_bg_light),
        ("LEFTPADDING", (0, 0), (-1, -1), 6 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6 * mm),
        ("TOPPADDING", (0, 0), (-1, -1), 4 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4 * mm),
        ("LINEBEFORE", (0, 0), (-1, -1), 3, c_black),
    ]))
    story.append(quote_box)
    story.append(Spacer(1, 5 * mm))

    story.append(Paragraph("Les Trois Pièges qui Détruisent la Valeur", s_section_title))
    story.append(Spacer(1, 2 * mm))

    story.append(Paragraph(
        "<b>1. Le piège du temps facturé :</b> Les agences conventionnelles sont incitées à faire durer les projets. Chaque semaine supplémentaire de cadrage et de comités de pilotage est une semaine facturée, retardant votre confrontation avec les vrais clients.<br/><br/>"
        "<b>2. Le piège du design superficiel :</b> Un produit digital ne doit pas seulement être 'joli'. Il doit inspirer une autorité incontestable. Une interface confuse ou générique détruit instantanément la valeur perçue de votre offre et justifie des négociations à la baisse.<br/><br/>"
        "<b>3. Le piège de la dilution des responsabilités :</b> Des commerciaux qui vendent ce qu'ils ne fabriquent pas, puis délèguent à des exécutants juniors qui ne comprennent rien à vos enjeux business. Vous perdez du temps à réexpliquer votre vision à chaque étape.",
        s_body
    ))

    # ==========================================================================
    # PAGE 3 : CHAPITRE 2 — LA VISION & MÉTHODE LONSIDE
    # ==========================================================================
    story.append(PageBreak())
    story.append(Paragraph("02 / NOTRE POSITIONNEMENT", s_chapter_tag))
    story.append(Spacer(1, 1 * mm))
    story.append(Paragraph("L'Élégance comme Multiplicateur Commercial", s_chapter_title))
    story.append(Spacer(1, 4 * mm))

    story.append(Paragraph(
        "Chez Lonside, nous abordons la création de logiciels et de plateformes web comme une discipline de haute précision. Inspirés par les entreprises qui dominent leur secteur à l'international (Apple, Stripe, Linear), nous appliquons une règle fondamentale : <b>la simplicité radicale est l'ultime sophistication commerciale.</b>",
        s_body
    ))
    story.append(Spacer(1, 4 * mm))

    # Tableau 3 piliers Lonside
    c_p1 = [
        Paragraph("<b>CLARTÉ ABSOLUE</b>", s_card_tag),
        Spacer(1, 1 * mm),
        Paragraph("Votre proposition de valeur est comprise en un regard. Chaque élément d'interface guide le visiteur vers l'action sans friction mentale.", s_card_p)
    ]
    c_p2 = [
        Paragraph("<b>VITESSE D'ACTION</b>", s_card_tag),
        Spacer(1, 1 * mm),
        Paragraph("Chaque seconde de gagnée sur une expérience client multiplie directement votre taux de conversion. La fluidité crée le désir d'achat.", s_card_p)
    ]
    c_p3 = [
        Paragraph("<b>AUTORITÉ VISUELLE</b>", s_card_tag),
        Spacer(1, 1 * mm),
        Paragraph("Une identité monochrome épurée et des finitions impeccables transforment votre statut : vous n'êtes plus une option, vous devenez la référence.", s_card_p)
    ]

    pillars_table = Table([[c_p1, c_p2, c_p3]], colWidths=[55 * mm, 55 * mm, 55 * mm])
    pillars_table.setStyle(TableStyle([
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
    story.append(pillars_table)
    story.append(Spacer(1, 6 * mm))

    story.append(Paragraph("La Méthode Commando : Zéro Bureaucratie", s_section_title))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(
        "Nous avons délibérément supprimé tous les irritants qui ralentissent habituellement les entreprises :<br/>"
        "• <b>Des forfaits fermes :</b> Vos budgets sont verrouillés au centime près. Zéro surprise, zéro avenant imprévu.<br/>"
        "• <b>Des délais immuables :</b> 14 jours ou 30 jours. Vos dates de lancement sont sacrées.<br/>"
        "• <b>Un interlocuteur unique et décisionnaire :</b> Vous dialoguez directement avec les créateurs de votre produit.<br/>"
        "• <b>Une propriété totale et sans engagement :</b> Vous êtes propriétaire à 100% de votre produit et de vos accès dès le jour de livraison.",
        s_body
    ))

    # ==========================================================================
    # PAGE 4 : CHAPITRE 3 — CATALOGUE OFFRES : SPRINT LAUNCH (14 JOURS)
    # ==========================================================================
    story.append(PageBreak())
    story.append(Paragraph("03 / CATALOGUE D'OFFRES DE SERVICES", s_chapter_tag))
    story.append(Spacer(1, 1 * mm))
    story.append(Paragraph("Sprint Launch : De l'Idée au Live en 14 Jours", s_chapter_title))
    story.append(Spacer(1, 4 * mm))

    story.append(Paragraph(
        "Le <b>Sprint Launch</b> est conçu pour les entreprises et les fondateurs qui doivent conquérir un marché immédiatement sans s'enliser dans des mois de développement théorique.",
        s_body
    ))
    story.append(Spacer(1, 4 * mm))

    # Carte descriptive Offre 1
    launch_table_data = [
        [Paragraph("<b>OBJECTIF STRATÉGIQUE</b>", s_card_tag)],
        [Paragraph("Lancer une offre commerciale percutante, valider la demande et convertir immédiatement vos premiers clients premium.", s_body_bold)],
        [Spacer(1, 2 * mm)],
        [Paragraph("<b>LE PÉRIMÈTRE CLÉ EN MAIN :</b><br/>"
                   "• Conception sur mesure de 1 à 3 pages stratégiques (Page d'accueil conversion, Présentation de l'offre, Prise de contact / Réservation).<br/>"
                   "• Rédaction publicitaire et structuration des messages de vente selon les meilleurs standards de persuasion.<br/>"
                   "• Identité visuelle soignée : contrastes élégants, typographie de prestige et mise en page intuitive.<br/>"
                   "• Intégration de vos outils de réservation, formulaires de contact et capture de prospects qualifiés.<br/>"
                   "• Optimisation mobile intégrale (fluidité parfaite sur smartphones et tablettes).<br/>"
                   "• Mise en ligne complète, sécurisation de votre domaine et accompagnement à la prise en main.", s_body)],
        [Spacer(1, 2 * mm)],
        [Paragraph("<b>VOTRE RETOUR SUR INVESTISSEMENT :</b><br/>"
                   "• <b>Temps de mise sur le marché divisé par 4 :</b> Vous vendez dès le 15ème jour ouvré.<br/>"
                   "• <b>Taux de transformation supérieur :</b> Une clarté qui augmente le taux de conversion de vos campagnes de +40% à +85%.<br/>"
                   "• <b>Crédibilité immédiate :</b> Une image de marque qui justifie des prix plus élevés auprès de vos clients.", s_body_bold)]
    ]
    launch_table = Table(launch_table_data, colWidths=[170 * mm])
    launch_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_bg_light),
        ("BOX", (0, 0), (-1, -1), 1, c_border),
        ("ROUNDEDCORNERS", [5, 5, 5, 5]),
        ("TOPPADDING", (0, 0), (-1, -1), 3 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
    ]))
    story.append(launch_table)

    # ==========================================================================
    # PAGE 5 : CATALOGUE OFFRES : SPRINT SCALE & IMMERSION
    # ==========================================================================
    story.append(PageBreak())
    story.append(Paragraph("03 / CATALOGUE D'OFFRES DE SERVICES (SUITE)", s_chapter_tag))
    story.append(Spacer(1, 1 * mm))
    story.append(Paragraph("Sprint Scale & Immersion Dédiée", s_chapter_title))
    story.append(Spacer(1, 4 * mm))

    # Offre 2 : Sprint Scale
    scale_data = [
        [Paragraph("<b>OFFRE #2 : SPRINT SCALE (30 JOURS OUVRÉS)</b>", s_card_tag)],
        [Paragraph("L'Infrastructure Complète pour Décupler vos Ventes", s_card_h)],
        [Paragraph(
            "<b>Pour qui ?</b> Les entreprises en pleine expansion, les plateformes de services et les offres à fort volume de transactions.<br/>"
            "<b>Le Périmètre :</b> Jusqu'à 7 écrans interactifs complets, intégration du paiement en ligne sécurisé et des abonnements récurrents, espace client privé, tableaux de bord de gestion et support multilingue.<br/>"
            "<b>Bénéfice Business :</b> Une expérience d'achat sans aucune friction, capable d'absorber des dizaines de milliers de visiteurs sans ralentissement.",
            s_body
        )]
    ]
    t_scale = Table(scale_data, colWidths=[170 * mm])
    t_scale.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_bg_light),
        ("BOX", (0, 0), (-1, -1), 1, c_border),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("TOPPADDING", (0, 0), (-1, -1), 3 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
    ]))
    story.append(t_scale)
    story.append(Spacer(1, 5 * mm))

    # Offre 3 : Immersion Squad
    squad_data = [
        [Paragraph("<b>OFFRE #3 : IMMERSION DÉDIÉE (TRIMESTRIEL / SEMESTRIEL)</b>", s_card_tag)],
        [Paragraph("Une Force de Frappe Senior Intégrée à Votre Équipe", s_card_h)],
        [Paragraph(
            "<b>Pour qui ?</b> Les dirigeants qui ont besoin d'une équipe de direction produit et design sans supporter les lenteurs et le coût fixe d'un double recrutement en interne.<br/>"
            "<b>Le Mode Opératoire :</b> Un binôme senior dédié (Direction Produit + Direction Créative) greffé à votre quotidien. Deux livraisons concrètes par semaine, communication directe et priorisation sur la rentabilité.<br/>"
            "<b>Bénéfice Business :</b> Vélocité d'exécution multipliée par deux, refonte complète de vos parcours utilisateurs et transmission des meilleures pratiques à vos équipes.",
            s_body
        )]
    ]
    t_squad = Table(squad_data, colWidths=[170 * mm])
    t_squad.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_bg_light),
        ("BOX", (0, 0), (-1, -1), 1, c_border),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("TOPPADDING", (0, 0), (-1, -1), 3 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
    ]))
    story.append(t_squad)

    # ==========================================
    # PAGE 6 : CHAPITRE 4 — ÉTUDES DE CAS & EXEMPLES
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("04 / RÉSULTATS & IMPACT CLIENT", s_chapter_tag))
    story.append(Spacer(1, 1 * mm))
    story.append(Paragraph("Études de Cas : La Preuve par l'Exemple", s_chapter_title))
    story.append(Spacer(1, 4 * mm))

    story.append(Paragraph(
        "Ce qui compte n'est pas le nombre d'heures passées, mais la transformation tangible observée sur votre chiffre d'affaires et votre réputation de marque.",
        s_body
    ))
    story.append(Spacer(1, 4 * mm))

    # Étude de cas 1
    case1_data = [
        [Paragraph("<b>CAS #1 : REPOSITIONNEMENT HAUT DE GAMME POUR UNE ENTREPRISE DE CONSEIL</b>", s_card_tag)],
        [Paragraph("Doublement du panier moyen et suppression des cycles de négociation", s_section_title)],
        [Paragraph(
            "<b>Le Défi :</b> Une offre de très haute valeur mais présentée sur un site daté et verbeux, incitant les prospects à négocier les tarifs à la baisse.<br/>"
            "<b>L'Intervention Lonside (Sprint Launch - 14j) :</b> Clarification chirurgicale de la proposition de valeur, design monochrome inspiré de l'édition d'art, parcours de réservation qualifié.<br/>"
            "<b>Le Résultat :</b> Taux de conversion des demandes d'entretien en hausse de +110%. Les clients signent sans discuter les honoraires, impressionnés par le professionnalisme de la plateforme.",
            s_body
        )]
    ]
    t_case1 = Table(case1_data, colWidths=[170 * mm])
    t_case1.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_bg_light),
        ("BOX", (0, 0), (-1, -1), 0.5, c_border),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("TOPPADDING", (0, 0), (-1, -1), 3 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
    ]))
    story.append(t_case1)
    story.append(Spacer(1, 4 * mm))

    # Étude de cas 2
    case2_data = [
        [Paragraph("<b>CAS #2 : LANCEMENT D'UN SERVICE DIGITAL PAR ABONNEMENT</b>", s_card_tag)],
        [Paragraph("De l'esquisse sur papier à 500 abonnés payants dès le premier mois", s_section_title)],
        [Paragraph(
            "<b>Le Défi :</b> Valider un concept de service sans dépenser 100 000 € en recherche et développement préalable.<br/>"
            "<b>L'Intervention Lonside (Sprint Scale - 30j) :</b> Création de la plateforme d'accès, intégration des paiements récurrents et parcours d'onboarding fluide en 3 étapes.<br/>"
            "<b>Le Résultat :</b> Lancement public respecté au jour près. 500 clients payants onboardés sans aucune friction d'assistance, rentabilisant l'investissement dès le deuxième mois.",
            s_body
        )]
    ]
    t_case2 = Table(case2_data, colWidths=[170 * mm])
    t_case2.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_bg_light),
        ("BOX", (0, 0), (-1, -1), 0.5, c_border),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("TOPPADDING", (0, 0), (-1, -1), 3 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
    ]))
    story.append(t_case2)

    # ==========================================================================
    # PAGE 7 : CHAPITRE 5 — PASSER À L'ACTION : DIAGNOSTIC OFFERT
    # ==========================================================================
    story.append(PageBreak())
    story.append(Paragraph("05 / VOTRE PROCHAINE ÉTAPE", s_chapter_tag))
    story.append(Spacer(1, 1 * mm))
    story.append(Paragraph("Construisons Votre Succès Commercial", s_chapter_title))
    story.append(Spacer(1, 4 * mm))

    story.append(Paragraph(
        "Chaque mois passé avec un produit digital inadapté représente des opportunités perdues, des clients qui s'en vont et une érosion silencieuse de votre réputation.<br/><br/>"
        "Nous ne prenons que <b>3 nouveaux projets par trimestre</b> afin de garantir une implication totale et une qualité d'exécution irréprochable.",
        s_body
    ))
    story.append(Spacer(1, 5 * mm))

    # Grande boîte noire de Closing
    closing_box_data = [
        [Paragraph("<b>VOTRE DIAGNOSTIC STRATÉGIQUE OFFERT (30 MINUTES)</b>", ParagraphStyle("ClTitle", fontName="Helvetica-Bold", fontSize=13, leading=17, textColor=c_white))],
        [Spacer(1, 2 * mm)],
        [Paragraph(
            "Avant tout engagement, nous vous proposons une session privée de 30 minutes avec notre direction produit.<br/><br/>"
            "<b>Ce que nous analyserons ensemble :</b><br/>"
            "1. Les blocages majeurs qui freinent vos conversions actuelles.<br/>"
            "2. Le potentiel d'optimisation de votre image et de vos parcours clients.<br/>"
            "3. La feuille de route concrète pour lancer votre projet en 14 ou 30 jours.<br/><br/>"
            "<b>Cette session est entièrement offerte et sans engagement.</b> Nous vous remettrons des recommandations actionnables dès le lendemain.",
            ParagraphStyle("ClBody", fontName="Helvetica", fontSize=9, leading=14.5, textColor=colors.HexColor("#e4e4e7"))
        )],
        [Spacer(1, 4 * mm)],
        [Paragraph("<b>RÉSERVEZ VOTRE SESSION :</b> contact@lonside.com<br/><font color='#a1a1aa' size='8'>Réponse garantie sous 24 heures ouvrées.</font>", ParagraphStyle("ClContact", fontName="Helvetica-Bold", fontSize=10, leading=15, textColor=c_white))]
    ]
    t_closing = Table(closing_box_data, colWidths=[170 * mm])
    t_closing.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_black),
        ("ROUNDEDCORNERS", [6, 6, 6, 6]),
        ("TOPPADDING", (0, 0), (-1, -1), 5 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5 * mm),
        ("LEFTPADDING", (0, 0), (-1, -1), 6 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6 * mm),
    ]))
    story.append(t_closing)
    story.append(Spacer(1, 8 * mm))

    story.append(Paragraph(
        "<b>lonside.</b> — Conception et développement de produits numériques d'exception.<br/>"
        "Tous droits réservés. Document réservé aux dirigeants et décideurs de projets digitaux.",
        ParagraphStyle("LegalP", fontName="Helvetica", fontSize=8, leading=12, textColor=c_gray, alignment=1)
    ))

    doc.build(story, canvasmaker=WhitepaperCanvas)
    print(f"PDF Livre Blanc Lonside généré : {output_pdf}")

if __name__ == "__main__":
    os.makedirs("docs", exist_ok=True)
    os.makedirs("public", exist_ok=True)
    build_whitepaper_pdf("docs/LONSIDE_LIVRE_BLANC_COMMERCIAL.pdf")
    build_whitepaper_pdf("public/LONSIDE_LIVRE_BLANC_COMMERCIAL.pdf")
