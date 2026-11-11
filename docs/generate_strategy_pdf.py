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
    Image as RLImage,
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
        self.drawString(20 * mm, 282 * mm, "LONSIDE  //  LE MASTER PLAN STRATÉGIQUE (2027 — 2029+)")
        self.drawRightString(190 * mm, 282 * mm, "SERVICES (2027) · MÉDIA (2028) · SAAS (2029+)")
        self.setStrokeColor(colors.HexColor("#e4e4e7"))
        self.setLineWidth(0.5)
        self.line(20 * mm, 280 * mm, 190 * mm, 280 * mm)

        # Pied de page
        self.line(20 * mm, 15 * mm, 190 * mm, 15 * mm)
        self.drawString(20 * mm, 11 * mm, "CONFIDENTIEL STRATÉGIQUE — LONSIDE (TECHNOLOGY · PEOPLE · IDEAS)")
        page_str = f"PAGE {self._pageNumber} / {page_count}"
        self.drawRightString(190 * mm, 11 * mm, page_str)
        self.restoreState()

def create_strategy_master_pdf(output_path, img_brand, img_road, img_media):
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

    style_brand = ParagraphStyle("Brd", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=10, leading=12, textColor=C_MUTED, letterSpacing=2.5)
    style_title = ParagraphStyle("Ttl", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=22, leading=26, textColor=C_BLACK)
    style_sub = ParagraphStyle("Sub", parent=styles["Normal"], fontName="Helvetica", fontSize=11, leading=14, textColor=C_MUTED)
    style_h1 = ParagraphStyle("H1", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=12.5, leading=15, textColor=C_BLACK, spaceBefore=8, spaceAfter=4, keepWithNext=True)
    style_h2 = ParagraphStyle("H2", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=10, leading=13, textColor=C_DARK, spaceBefore=6, spaceAfter=2, keepWithNext=True)
    style_body = ParagraphStyle("Body", parent=styles["Normal"], fontName="Helvetica", fontSize=8.5, leading=11.5, textColor=C_BODY, spaceAfter=3)
    style_callout = ParagraphStyle("Call", parent=styles["Normal"], fontName="Helvetica", fontSize=8, leading=11, textColor=C_BODY)
    style_caption = ParagraphStyle("Cap", parent=styles["Normal"], fontName="Helvetica-Oblique", fontSize=7.5, leading=9.5, textColor=C_MUTED, spaceAfter=4)
    style_th = ParagraphStyle("TH", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=7.5, leading=9, textColor=colors.white)
    style_td = ParagraphStyle("TD", parent=styles["Normal"], fontName="Helvetica", fontSize=7.2, leading=9, textColor=C_BODY)
    style_td_b = ParagraphStyle("TDB", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=7.2, leading=9, textColor=C_BLACK)

    story = []

    # ── COUVERTURE
    story.append(Spacer(1, 20 * mm))
    story.append(Paragraph("LONSIDE", style_brand))
    story.append(Spacer(1, 5 * mm))
    story.append(Paragraph("LE MASTER PLAN STRATÉGIQUE & ROADMAP (2027 — 2029+)", style_title))
    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph("Architecture de Marque, Périmètre Détaillé des Services, Grille Média & Édition de Logiciels SaaS", style_sub))
    story.append(Spacer(1, 6 * mm))
    story.append(HRFlowable(width="100%", thickness=1.5, color=C_BLACK, spaceAfter=8 * mm))

    manifeste = """
    <b>Lonside rassemble sous une même bannière deux forces souveraines :</b><br/>
    <b>1. Lonside Software :</b> Conception et édition de logiciels, SaaS et produits numériques propriétaires sous le label « A Product by Lonside ».<br/>
    <b>2. Lonside Studio :</b> Média tech, interviews de builders, podcasts vidéo et formats originaux d'immersion technique.<br/><br/>
    Notre stratégie démarre en <b>2027</b> par la prestation d'ingénierie haut de gamme (sprints fermes dès 14 jours). Cette phase fondatrice finance l'expansion sur fonds propres (bootstrapped), 
    établit notre autorité technique, confronte l'équipe aux besoins réels et constitue le portefeuille client initial. 
    Cette trésorerie est ensuite réinvestie dès <b>2028</b> pour déployer le média Lonside Studio, créant un avantage de distribution asymétrique (CAC = 0 €) 
    permettant de lancer dès <b>2029+</b> nos propres logiciels SaaS avec une conversion immédiate.
    """
    call_table = Table([[Paragraph(manifeste, style_callout)]], colWidths=[170 * mm])
    call_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_SURFACE),
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(call_table)

    story.append(Spacer(1, 10 * mm))

    meta_data = [
        [Paragraph("<b>Marque Principale :</b> lonside. (Technology · People · Ideas)", style_td), Paragraph("<b>Version :</b> 3.0 (Master Strategic Blueprint)", style_td)],
        [Paragraph("<b>Branches Opérationnelles :</b> Lonside Software & Lonside Studio", style_td), Paragraph("<b>Roadmap :</b> Phase 1 (2027) -> Phase 2 (2028) -> Phase 3 (2029+)", style_td)],
        [Paragraph("<b>Classification :</b> Confidentiel Interne / Investisseurs", style_td), Paragraph("<b>Modèle :</b> Services Cash -> Media Flywheel -> Proprietary SaaS", style_td)],
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

    # ── SECTION 1 : ARCHITECTURE DE MARQUE & FLYWHEEL
    story.append(Paragraph("1. ARCHITECTURE DE MARQUE & SYNERGIE EN FLYWHEEL", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=3 * mm))
    story.append(Paragraph("Lonside combine l'ingénierie logicielle d'élite et la force de diffusion média dans un écosystème auto-porteur :", style_body))

    if os.path.exists(img_brand):
        story.append(RLImage(img_brand, width=170 * mm, height=85 * mm))
        story.append(Paragraph("Figure 1.1 : Schéma d'Architecture de Marque et Volant d'Inertie Lonside.", style_caption))

    story.append(Spacer(1, 2 * mm))

    # ── SECTION 2 : ORIGINE DES DÉCISIONS
    story.append(Paragraph("2. L'ORIGINE DES DÉCISIONS STRATÉGIQUES (BENCHMARKS MONDIAUX)", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=3 * mm))
    story.append(Paragraph("<b>• Référence 37signals (Basecamp) :</b> Financement initial par des prestations web d'élite, puis réinvestissement des profits pour éditer un logiciel SaaS souverain sans investisseurs externes.", style_body))
    story.append(Paragraph("<b>• Référence Stripe Press & Developer Authority :</b> La maîtrise de la culture technique et l'autorité intellectuelle créent une confiance inébranlable.", style_body))
    story.append(Paragraph("<b>• Référence MetaLab / Tiny :</b> Transformation d'un studio d'ingénierie haut de gamme en holding de produits logiciels autonomes et très rentables.", style_body))
    story.append(Paragraph("<b>• Échecs évités des forums (Hacker News / Indie Hackers) :</b> (1) Zéro SaaS développé dans le vide sans cash ni réseau, (2) Zéro modèle d'agence en TJM lourd, (3) Zéro podcast bavard générique, (4) Zéro studio physique loué prématurément.", style_body))
    story.append(PageBreak())

    # ── SECTION 3 : PHASE 1 (2027) — LES SERVICES
    story.append(Paragraph("3. PHASE 1 (2027) : PÉRIMÈTRE DÉTAILLÉ DE CHAQUE SERVICE, RÈGLES & RÉSULTATS", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=3 * mm))
    story.append(Paragraph("En 2027, la mission exclusive est de bâtir la réputation d'exécution Lonside et d'accumuler une trésorerie souveraine de réserve (> 100k€).", style_body))

    serv_data = [
        [Paragraph("Service", style_th), Paragraph("Périmètre Inclus", style_th), Paragraph("Règles d'Exécution", style_th), Paragraph("Livrable Client Remis", style_th), Paragraph("Résultat Client Concret", style_th)],
        [Paragraph("Sprint Launch<br/>(6 900 € · 14j)", style_td_b), Paragraph("• Cadrage CDC & DB<br/>• Next.js App Router<br/>• Auth OAuth & JWT<br/>• Stripe checkout live<br/>• APIs & Webhooks", style_td), Paragraph("• 14 jours ouvrés scellés<br/>• Forfait ferme (0 surcoût)<br/>• 1 Lead Architect dédié<br/>• Zéro junior, zéro sous-traitance", style_td), Paragraph("• Repo GitHub cédé 100%<br/>• App live Vercel Edge<br/>• Stripe prêt à encaisser<br/>• Vidéo Loom d'architecture<br/>• Garantie 30 jours", style_td), Paragraph("Encaissement immédiat de vrais clients dès J14 sans dette technique.", style_td_b)],
        [Paragraph("Sprint Scale<br/>(13 900 € · 30j)", style_td_b), Paragraph("• Tout Sprint Launch<br/>• Portails multi-rôles RBAC<br/>• Moteur calculs d'arrière-plan<br/>• Notifications temps réel", style_td), Paragraph("• 30 jours ouvrés scellés<br/>• Architecture distribuée<br/>• Tests automatisés > 80%<br/>• Audit trail & soft-delete", style_td), Paragraph("• Repo GitHub cédé 100%<br/>• Base PostgreSQL 3NF<br/>• Migrations versionnées<br/>• Runbooks techniques<br/>• Garantie 30 jours", style_td), Paragraph("Plateforme prête pour des milliers d'utilisateurs et due diligence d'investisseurs.", style_td_b)],
        [Paragraph("Régie Senior<br/>(Dès 5 500 €/m)", style_td_b), Paragraph("• 1 à 3 ingénieurs seniors<br/>• Slack client en direct<br/>• Rituels agiles & daily<br/>• Sortie continue de features", style_td), Paragraph("• Semaine d'essai de 5j<br/>• Sans engagement lourd<br/>• Ajustement libre mensuel<br/>• Disponibilité immédiate", style_td), Paragraph("• Commits & PRs directes<br/>• Revues de code strictes<br/>• Transfert de compétences", style_td), Paragraph("Accélération immédiate de la roadmap sans les coûts ni délais d'un recrutement.", style_td_b)]
    ]
    t_serv = Table(serv_data, colWidths=[24 * mm, 38 * mm, 36 * mm, 36 * mm, 36 * mm])
    t_serv.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_BLACK),
        ('GRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_serv)
    story.append(PageBreak())

    # ── SECTION 4 : PHASE 2 (2028) — LE MÉDIA
    story.append(Paragraph("4. PHASE 2 (2028) : LONSIDE STUDIO — GRILLE DES FORMATS ÉDITORIAUX", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=3 * mm))
    story.append(Paragraph("L'attention qualifiée est l'actif le plus cher de la tech. Dès 2028, Lonside Studio déploie 3 formats originaux sur YouTube et réseaux pros :", style_body))

    if os.path.exists(img_media):
        story.append(RLImage(img_media, width=170 * mm, height=62 * mm))
        story.append(Paragraph("Figure 4.1 : Grille des Formats Éditoriaux Lonside Studio.", style_caption))

    story.append(Paragraph("<b>1. Lonside Conversations (40 — 60 min) :</b> Entretiens de fond avec builders et fondateurs (parcours, choix stratégiques, échecs réels).", style_body))
    story.append(Paragraph("<b>2. Inside the Build (15 — 25 min) :</b> Coulisses techniques en partage d'écran et démos de code réelles sans filtre.", style_body))
    story.append(Paragraph("<b>3. The Turning Point (5 — 10 min) :</b> Récits condensés et percutants sur un moment de bascule (pivots, crises, succès).", style_body))
    story.append(Paragraph("<b>• Modèle Lean :</b> Zéro studio physique à louer à l'année. Tournages nomades haute précision et location ponctuelle d'espaces à l'heure.", style_body))

    story.append(Spacer(1, 2 * mm))

    # ── SECTION 5 : PHASE 3 (2029+) — LES PRODUITS SAAS
    story.append(Paragraph("5. PHASE 3 (2029+) : LONSIDE SOFTWARE — ÉDITION DE PRODUITS SAAS", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=3 * mm))
    story.append(Paragraph("<b>• La Règle des 'Trois Fois' :</b> Un logiciel n'est lancé que s'il résout une douleur vécue chez au moins 3 clients différents en prestation.", style_body))
    story.append(Paragraph("<b>• Sceau Institutionnel :</b> Chaque logiciel possède son identité avec la mention de prestige <b>« A Product by Lonside »</b>.", style_body))
    story.append(Paragraph("<b>• Distribution à CAC = 0 € :</b> Présentation des produits directement dans les épisodes 'Inside the Build' de Lonside Studio.", style_body))
    story.append(PageBreak())

    # ── SECTION 6 : ROADMAP ET ALLOCATION DU TEMPS
    story.append(Paragraph("6. ROADMAP STRATÉGIQUE (2027 — 2029+) & MATRICE CHRONOLOGIQUE", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=3 * mm))

    if os.path.exists(img_road):
        story.append(RLImage(img_road, width=170 * mm, height=73 * mm))
        story.append(Paragraph("Figure 6.1 : Chronologie de Déploiement en 3 Phases Majeures (2027 — 2029+).", style_caption))

    road_data = [
        [Paragraph("Période", style_th), Paragraph("Focus Stratégique", style_th), Paragraph("Jalons Opérationnels Clés", style_th), Paragraph("Objectif / KPI", style_th)],
        [Paragraph("2027<br/>(Phase 1 : Maintenant)", style_td_b), Paragraph("Consolidation Services & Trésorerie", style_td), Paragraph("• Exécution sprints Launch & Scale<br/>• Constitution d'un portefeuille de 20 clients<br/>• Trésorerie de réserve : 100k€", style_td), Paragraph("35k€ - 60k€ / mois<br/>Marge nette > 70%<br/>100% autofinancé", style_td)],
        [Paragraph("2028<br/>(Phase 2 : Ensuite)", style_td_b), Paragraph("Déploiement Média Lonside Studio", style_td), Paragraph("• Lancement chaîne YouTube & podcasts<br/>• Production de 24 épisodes Conversations<br/>• Réseau d'ambassadeurs activé", style_td), Paragraph("25 000 abonnés qualifiés<br/>Deals Inbound continus<br/>Sponsors partenaires", style_td)],
        [Paragraph("2029+<br/>(Phase 3 : Progressivement)", style_td_b), Paragraph("Édition SaaS Lonside Software", style_td), Paragraph("• Lancement de 2 logiciels SaaS propriétaires<br/>• Signature « A Product by Lonside »<br/>• Distribution à 0 € CAC via le média", style_td), Paragraph("ARR SaaS > 250k€<br/>ARR Produits > CA Services<br/>Valorisation d'actifs", style_td)],
    ]
    t_road = Table(road_data, colWidths=[24 * mm, 44 * mm, 64 * mm, 38 * mm])
    t_road.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_BLACK),
        ('GRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_road)

    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph("<b>Discipline d'Allocation du Temps :</b> 2027 (80% Services / 15% Média / 5% R&D) ➔ 2028 (60% Services / 25% Média / 15% SaaS) ➔ 2029+ (35% Services / 25% Média / 40% SaaS).", style_body))

    story.append(Spacer(1, 6 * mm))
    story.append(Paragraph("<b>LONSIDE // TECHNOLOGY · PEOPLE · IDEAS — AVRIL 2026</b>", ParagraphStyle("Fin", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=8, textColor=C_BLACK)))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF Stratégique Master (avec illustrations) généré : {output_path}")

if __name__ == "__main__":
    docs_dir = os.path.dirname(__file__)
    img_b = os.path.join(docs_dir, "diagram_brand_architecture.png")
    img_r = os.path.join(docs_dir, "diagram_roadmap_timeline.png")
    img_m = os.path.join(docs_dir, "diagram_media_formats.png")

    out_docs = os.path.join(docs_dir, "LONSIDE_MASTER_PLAN_STRATEGIQUE_ET_ROADMAP.pdf")
    out_public = os.path.join(os.path.dirname(docs_dir), "public", "LONSIDE_MASTER_PLAN_STRATEGIQUE_ET_ROADMAP.pdf")

    create_strategy_master_pdf(out_docs, img_b, img_r, img_m)
    create_strategy_master_pdf(out_public, img_b, img_r, img_m)
