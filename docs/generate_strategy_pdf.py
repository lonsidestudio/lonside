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
            return

        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#71717a"))

        # En-tête
        self.drawString(20 * mm, 282 * mm, "LONSIDE  //  LE MASTER PLAN STRATÉGIQUE (2026 — 2028)")
        self.drawRightString(190 * mm, 282 * mm, "SERVICES · STUDIO MÉDIA · SAAS EDITION")
        self.setStrokeColor(colors.HexColor("#e4e4e7"))
        self.setLineWidth(0.5)
        self.line(20 * mm, 280 * mm, 190 * mm, 280 * mm)

        # Pied de page
        self.line(20 * mm, 15 * mm, 190 * mm, 15 * mm)
        self.drawString(20 * mm, 11 * mm, "CONFIDENTIEL STRATÉGIQUE — LONSIDE (TECHNOLOGY · PEOPLE · IDEAS)")
        page_str = f"PAGE {self._pageNumber} / {page_count}"
        self.drawRightString(190 * mm, 11 * mm, page_str)
        self.restoreState()

def create_strategy_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
        topMargin=22 * mm,
        bottomMargin=22 * mm,
    )

    styles = getSampleStyleSheet()

    C_BLACK = colors.HexColor("#09090b")
    C_DARK = colors.HexColor("#18181b")
    C_BODY = colors.HexColor("#27272a")
    C_MUTED = colors.HexColor("#71717a")
    C_SURFACE = colors.HexColor("#fafafa")
    C_BORDER = colors.HexColor("#e4e4e7")

    style_brand = ParagraphStyle("Brd", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=11, leading=13, textColor=C_MUTED, letterSpacing=3)
    style_title = ParagraphStyle("Ttl", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=26, leading=30, textColor=C_BLACK)
    style_sub = ParagraphStyle("Sub", parent=styles["Normal"], fontName="Helvetica", fontSize=11.5, leading=15, textColor=C_MUTED)
    style_h1 = ParagraphStyle("H1", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=13, leading=16, textColor=C_BLACK, spaceBefore=10, spaceAfter=4, keepWithNext=True)
    style_h2 = ParagraphStyle("H2", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=10, leading=13, textColor=C_DARK, spaceBefore=6, spaceAfter=3, keepWithNext=True)
    style_body = ParagraphStyle("Body", parent=styles["Normal"], fontName="Helvetica", fontSize=8.5, leading=11.5, textColor=C_BODY, spaceAfter=3)
    style_callout = ParagraphStyle("Call", parent=styles["Normal"], fontName="Helvetica", fontSize=8.5, leading=11.5, textColor=C_BODY)
    style_th = ParagraphStyle("TH", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=7.5, leading=9.5, textColor=colors.white)
    style_td = ParagraphStyle("TD", parent=styles["Normal"], fontName="Helvetica", fontSize=7.5, leading=9.5, textColor=C_BODY)
    style_td_b = ParagraphStyle("TDB", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=7.5, leading=9.5, textColor=C_BLACK)

    story = []

    # ── COUVERTURE
    story.append(Spacer(1, 25 * mm))
    story.append(Paragraph("LONSIDE", style_brand))
    story.append(Spacer(1, 6 * mm))
    story.append(Paragraph("LE MASTER PLAN STRATÉGIQUE (2026 — 2028)", style_title))
    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph("De l'Atelier d'Ingénierie Logicielle au Média d'Influence et à l'Édition de Produits SaaS : Modèle Flywheel, Rationale des Décisions & Roadmap Opérationnelle", style_sub))
    story.append(Spacer(1, 8 * mm))
    story.append(HRFlowable(width="100%", thickness=1.5, color=C_BLACK, spaceAfter=10 * mm))

    manifeste = """
    <b>Lonside n'est pas une simple agence de prestations, ni un média passif : c'est un écosystème hybride à haute vélocité articulé autour de deux branches maîtresses :</b><br/>
    <b>1. Lonside Software :</b> Conception, architecture et édition de logiciels, SaaS et plateformes cloud propriétaires.<br/>
    <b>2. Lonside Studio :</b> Média premium d'interviews, podcasts vidéo, coulisses de code et formats originaux (YouTube, Publications).<br/><br/>
    Notre stratégie démarre par la prestation d'ingénierie haut de gamme en forfaits fermes. Cette phase initiale finance l'expansion sur fonds propres (bootstrapped), 
    établit notre autorité technique, confronte l'équipe aux besoins réels et constitue le portefeuille client initial. 
    La trésorerie générée est ensuite réinvestie pour déployer le média Lonside Studio, créant un avantage de distribution asymétrique (CAC = 0 €) 
    au service de nos futurs logiciels édités sous la signature « A Product by Lonside ».
    """
    call_table = Table([[Paragraph(manifeste, style_callout)]], colWidths=[170 * mm])
    call_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_SURFACE),
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('TOPPADDING', (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(call_table)

    story.append(Spacer(1, 15 * mm))

    meta_data = [
        [Paragraph("<b>Marque Principale :</b> Lonside (Technology · People · Ideas)", style_td), Paragraph("<b>Version :</b> 2.0 (Master Strategic Blueprint)", style_td)],
        [Paragraph("<b>Branches Opérationnelles :</b> Lonside Software & Lonside Studio", style_td), Paragraph("<b>Date d'Effet :</b> Avril 2026", style_td)],
        [Paragraph("<b>Classification :</b> Confidentiel Interne / Investisseurs", style_td), Paragraph("<b>Modèle :</b> Services Cash-Flow -> Media Flywheel -> SaaS", style_td)],
    ]
    t_meta = Table(meta_data, colWidths=[85 * mm, 85 * mm])
    t_meta.setStyle(TableStyle([
        ('LINEABOVE', (0,0), (-1,0), 0.5, C_BORDER),
        ('LINEBELOW', (0,-1), (-1,-1), 0.5, C_BORDER),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t_meta)
    story.append(PageBreak())

    # ── SECTION 1 : ORIGINE DES DÉCISIONS
    story.append(Paragraph("1. L'ORIGINE DES DÉCISIONS STRATÉGIQUES (RETOURS FORUMS & MARCHÉ)", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=3 * mm))
    story.append(Paragraph("Notre modèle est la synthèse des trajectoires de 37signals (Basecamp), Stripe, Vercel et MetaLab, ainsi que l'analyse des retours d'échecs sur Hacker News et Indie Hackers. Quatre pièges mortels sont éliminés :", style_body))
    story.append(Paragraph("<b>• Piège #1 (Le SaaS sans cash ni réseau) :</b> Développer un outil 12 mois dans l'ombre sans client. Décision : Démarrer par les services pour financer l'aventure et cartographier les besoins réels payants.", style_body))
    story.append(Paragraph("<b>• Piège #2 (L'agence zombie en TJM) :</b> Vendre des jours-hommes et crouler sous les charges. Décision : Forfaits fermes véloces (14j/30j) avec sanctuarisation de 20% du temps sur la R&D produit.", style_body))
    story.append(Paragraph("<b>• Piège #3 (Le podcast bavard générique) :</b> Décision : Niche chirurgicale 'Behind the Code' axée sur l'artisanat du logiciel, les choix d'architecture et les post-mortems d'échecs réels.", style_body))
    story.append(Paragraph("<b>• Piège #4 (Le studio physique prématuré) :</b> Décision : Approche 100% Lean avec tournages nomades haute précision et location ponctuelle d'espaces inspirants à l'heure.", style_body))

    story.append(Spacer(1, 3 * mm))

    # ── SECTION 2 : PHASE 1
    story.append(Paragraph("2. PHASE 1 (MAINTENANT) : CONSOLIDER LES SERVICES & LA TRÉSORERIE", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=3 * mm))
    story.append(Paragraph("<b>Objectif :</b> Atteindre 30k€ - 50k€ de CA mensuel avec une marge nette > 70%, autofinancée, sans investisseurs dilutifs.", style_body))
    story.append(Paragraph("<b>• Sprint Launch (6 900 € — 14j) :</b> Première version live en production avec encaissement Stripe actif.", style_body))
    story.append(Paragraph("<b>• Sprint Scale (13 900 € — 30j) :</b> Plateforme multi-rôles, calculs d'arrière-plan et résilience renforcée.", style_body))
    story.append(Paragraph("<b>• Régie d'Immersion (Dès 5 500 €/m) :</b> Squad senior embarquée pour revenus récurrents prédictibles.", style_body))
    story.append(Paragraph("<b>• Rôle caché des missions :</b> Chaque mission est un laboratoire qui permet de normaliser nos composants et d'identifier les besoins logiciels récurrents à transformer en SaaS propriétaire.", style_body))

    story.append(Spacer(1, 3 * mm))

    # ── SECTION 3 : PHASE 2
    story.append(Paragraph("3. PHASE 2 (ENSUITE) : LONSIDE STUDIO (LE MÉDIA & MOTEUR DE DISTRIBUTION)", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=3 * mm))
    story.append(Paragraph("L'attention est la barrière à l'entrée moderne. Lonside Studio déploie trois formats éditoriaux chirurgicaux :", style_body))
    story.append(Paragraph("<b>1. Lonside Conversations (40 — 60 min) :</b> Entretiens approfondis avec fondateurs, CTOs, ingénieurs et builders de renom sur leurs parcours, échecs réels et décisions charnières.", style_body))
    story.append(Paragraph("<b>2. Inside the Build (15 — 25 min) :</b> Coulisses techniques en partage d'écran : revue d'une architecture, post-mortem d'une panne critique, démonstration de cas réels.", style_body))
    story.append(Paragraph("<b>3. The Turning Point (5 — 10 min) :</b> Récit condensé et immersif sur un moment de bascule (licenciement transformé en succès, pivot in extremis, refus d'investisseur).", style_body))
    story.append(Paragraph("<b>• Conversion invisible :</b> Chaque invité devient un ambassadeur de Lonside, un client potentiel ou un futur utilisateur de nos logiciels.", style_body))
    story.append(PageBreak())

    # ── SECTION 4 : PHASE 3
    story.append(Paragraph("4. PHASE 3 (PROGRESSIVEMENT) : LONSIDE SOFTWARE (L'ÉDITION DE LOGICIELS SAAS)", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=3 * mm))
    story.append(Paragraph("Chaque produit dispose de son nom propre tout en arborant le label institutionnel <b>« A Product by Lonside »</b>.", style_body))
    story.append(Paragraph("<b>• Règle des 3 Prestations :</b> Un SaaS n'est lancé que s'il résout une douleur rencontrée au moins 3 fois en prestation client.", style_body))
    story.append(Paragraph("<b>• Monétisation Directe B2B :</b> Abonnements récurrents sans intermédiaire publicitaire, forte rentabilité unitaire.", style_body))
    story.append(Paragraph("<b>• Boring Tech & Densité :</b> Architecture épurée permettant à un seul senior de maintenir 3 à 5 produits sans dette technique.", style_body))
    story.append(Paragraph("<b>• Distribution à Coût Zéro :</b> Lancement public orchestré via les épisodes 'Inside the Build' de Lonside Studio (CAC = 0 €).", style_body))

    story.append(Spacer(1, 4 * mm))

    # ── SECTION 5 : ROADMAP & ALLOCATION 70/20/10
    story.append(Paragraph("5. ROADMAP STRATÉGIQUE (2026 — 2028) & DISCIPLINE DU TEMPS", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=3 * mm))

    road_data = [
        [Paragraph("Période", style_th), Paragraph("Focus Stratégique", style_th), Paragraph("Jalons Opérationnels", style_th), Paragraph("Objectif / KPI", style_th)],
        [Paragraph("S1 2026 (Maintenant)", style_td_b), Paragraph("Consolidation Services & Cash", style_td), Paragraph("• Exécution sprints Launch/Scale<br/>• Standardisation du design system", style_td), Paragraph("30k€ - 50k€ / mois<br/>100% autofinancé", style_td)],
        [Paragraph("S2 2026 (Ensuite)", style_td_b), Paragraph("Lancement Lonside Studio", style_td), Paragraph("• Chaîne YouTube & Conversations<br/>• 12 épisodes pilotes (setup Lean)", style_td), Paragraph("10k abonnés qualifiés<br/>Deals Inbound réguliers", style_td)],
        [Paragraph("S1 2027 (Accélération)", style_td_b), Paragraph("Incubation Premier SaaS", style_td), Paragraph("• MVP développé en sprint interne 14j<br/>• Lancement via 'Inside the Build'", style_td), Paragraph("50 premiers clients<br/>ARR initial : 25k€", style_td)],
        [Paragraph("2027 — 2028 (Maturité)", style_td_b), Paragraph("Holding Hybride", style_td), Paragraph("• 2-3 SaaS rentables en exploitation<br/>• Média référence tech francophone", style_td), Paragraph("ARR SaaS > CA Services<br/>Valorisation d'actifs", style_td)],
    ]
    t_road = Table(road_data, colWidths=[25 * mm, 45 * mm, 60 * mm, 40 * mm])
    t_road.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_BLACK),
        ('GRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_road)

    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph("<b>La Règle d'Or d'Allocation du Temps (70 / 20 / 10) :</b> 70% Ingénierie Client (Génération de cash & réputation) / 20% Lonside Studio (Création de contenu, interviews & audience) / 10% Lonside Software (R&D interne, prototypage SaaS). Inversion progressive vers 40% Services / 30% Média / 30% Produits au fil de la montée en puissance de l'ARR.", style_body))

    story.append(Spacer(1, 6 * mm))
    story.append(Paragraph("<b>LONSIDE // TECHNOLOGY · PEOPLE · IDEAS — AVRIL 2026</b>", ParagraphStyle("Fin", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=8, textColor=C_BLACK)))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF Stratégique généré : {output_path}")

if __name__ == "__main__":
    out_docs = os.path.join(os.path.dirname(__file__), "LONSIDE_MASTER_PLAN_STRATEGIQUE_ET_ROADMAP.pdf")
    out_public = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "LONSIDE_MASTER_PLAN_STRATEGIQUE_ET_ROADMAP.pdf")
    create_strategy_pdf(out_docs)
    create_strategy_pdf(out_public)
