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
        self.drawString(20 * mm, 282 * mm, "LONSIDE STUDIO  //  SPÉCIFICATION DES LIVRABLES & NORMES DE QUALITÉ")
        self.drawRightString(190 * mm, 282 * mm, "STANDARDS INTERNATIONAUX — AVRIL 2026")
        self.setStrokeColor(colors.HexColor("#e4e4e7"))
        self.setLineWidth(0.5)
        self.line(20 * mm, 280 * mm, 190 * mm, 280 * mm)

        # Pied de page
        self.line(20 * mm, 15 * mm, 190 * mm, 15 * mm)
        self.drawString(20 * mm, 11 * mm, "RÉFÉRENTIEL TECHNIQUE — ÉMISSION OFFICIELLE LONSIDE STUDIO")
        page_str = f"PAGE {self._pageNumber} / {page_count}"
        self.drawRightString(190 * mm, 11 * mm, page_str)
        self.restoreState()

def create_livrables_spec_pdf(output_path):
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
    style_title = ParagraphStyle("Ttl", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=24, leading=28, textColor=C_BLACK)
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
    story.append(Paragraph("LONSIDE STUDIO", style_brand))
    story.append(Spacer(1, 6 * mm))
    story.append(Paragraph("SPÉCIFICATION DU PACK DE LIVRAISON & CAHIER DES STANDARDS DE QUALITÉ", style_title))
    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph("Contenu Détaillé, Règles Strictes d'Exécution, Valeur Métier & Alignement sur les Références Mondiales (Linear, Stripe, Vercel, Work & Co)", style_sub))
    story.append(Spacer(1, 8 * mm))
    story.append(HRFlowable(width="100%", thickness=1.5, color=C_BLACK, spaceAfter=10 * mm))

    manifeste = """
    <b>Ce document constitue la Bible d'Exécution et le Cahier des Normes de Lonside Studio.</b> Pour chaque composante du pack de livraison, il définit sans ambiguïté : 
    (1) le contenu matériel et logiciel exact remis au client, (2) les règles d'art intransigeantes applicables à la production, 
    (3) la valeur business et d'évaluation transmise à l'entreprise, et (4) l'alignement sur les références internationales les plus avancées du marché (Linear, Stripe, Vercel, Work & Co, GitHub, Basecamp / Shape Up).
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
        [Paragraph("<b>Destinataires :</b> Direction, CTOs, Auditeurs & Investisseurs", style_td), Paragraph("<b>Version :</b> 2.0 (High-Precision Delivery Spec)", style_td)],
        [Paragraph("<b>Auteurs :</b> Direction Artistique & Opérationnelle (Kevin T.)", style_td), Paragraph("<b>Date d'Effet :</b> Avril 2026", style_td)],
        [Paragraph("<b>Classification :</b> Référentiel Officiel Lonside", style_td), Paragraph("<b>Opposabilité :</b> Annexe Contractuelle aux Sprints", style_td)],
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

    # ── LIVRABLES 1 & 2
    story.append(Paragraph("LIVRABLE #1 : DÉPÔT SOURCE & GOUVERNANCE GITHUB (RÉF. SHOPIFY / GITHUB)", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=3 * mm))
    story.append(Paragraph("<b>• Contenu exact :</b> Repo GitHub privé transféré, Clean Architecture DDD sans dépendance circulaire, commits atomiques sous Conventional Commits, .github/workflows CI, modèle .env.example, directives agents (.cursorrules, AGENTS.md).", style_body))
    story.append(Paragraph("<b>• Règles strictes :</b> Interdiction de push direct sur main, zéro secret en dur (détection GitGuardian/gitleaks), 100% TypeScript strict sans aucun 'any', installation complète vérifiée en 'npm i && npm run dev'.", style_body))
    story.append(Paragraph("<b>• Valeur souhaitée :</b> Onboarding d'un nouvel ingénieur en <15 min ; audit technique impeccable lors des levées de fonds (Due Diligence Série A/B sans décote).", style_body))

    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph("LIVRABLE #2 : SOCLE APPLICATIF & CLEAN ARCHITECTURE (RÉF. LINEAR / BASECAMP)", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=3 * mm))
    story.append(Paragraph("<b>• Contenu exact :</b> Next.js App Router (RSC purs pour zéro JS client inutile), séparation étanche (UI / Services Métier / DAL Repositories), gestion centralisée des erreurs (StudioException), invalidation optimiste du cache.", style_body))
    story.append(Paragraph("<b>• Règles strictes :</b> Composants <250 lignes, zéro requête N+1, zéro règle métier dans le JSX, état minimaliste basé sur les searchParams.", style_body))
    story.append(Paragraph("<b>• Valeur souhaitée :</b> Vitesse de navigation sans latence perceptive (60fps), évolutivité sans risque d'effondrement systémique.", style_body))

    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph("LIVRABLE #3 : INFRASTRUCTURE EDGE, VERCEL & CI/CD (RÉF. VERCEL / CLOUDFLARE)", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=3 * mm))
    story.append(Paragraph("<b>• Contenu exact :</b> Déploiement Vercel Anycast mondial, environnements étanches (Prod / Staging / Preview par PR), pipeline CI automatique (ESLint, tsc, tests unitaires, build), headers de sécurité (CSP, HSTS).", style_body))
    story.append(Paragraph("<b>• Règles strictes :</b> Core Web Vitals optimaux (LCP < 1.2s, CLS = 0, FID < 50ms), build de production < 90s, zéro downtime (déploiements atomiques avec rollback 1-clic).", style_body))
    story.append(Paragraph("<b>• Valeur souhaitée :</b> Coût de maintenance infra de 0€/an (économies de 50k€ de devops), résilience totale face aux pics de charge imprévus.", style_body))
    story.append(PageBreak())

    # ── LIVRABLES 4 & 5
    story.append(Paragraph("LIVRABLE #4 : MODÈLE DE DONNÉES & MIGRATIONS VERSIONNÉES (RÉF. STRIPE / SUPABASE)", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=3 * mm))
    story.append(Paragraph("<b>• Contenu exact :</b> Base PostgreSQL normalisée 3NF avec UUID v4, migrations versionnées réversibles (Drizzle/Prisma), soft-delete (deleted_at) et audit trail, interfaces TypeScript synchronisées.", style_body))
    story.append(Paragraph("<b>• Règles strictes :</b> Zéro modification manuelle en production, indexation obligatoire de toute clé de recherche/jointure, cloisonnement multi-tenants strict (RLS).", style_body))
    story.append(Paragraph("<b>• Valeur souhaitée :</b> Scalabilité jusqu'à 500 000 utilisateurs sans refonte, conformité bancaire et RGPD sans faille.", style_body))

    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph("LIVRABLE #5 : MOTEUR MONÉTIQUE STRIPE & FLUX DE VENTE (RÉF. STRIPE BILLING)", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=3 * mm))
    story.append(Paragraph("<b>• Contenu exact :</b> Tunnel Stripe (achats uniques, abonnements, essais), webhooks asynchrones avec déduplication idempotente (event_id), portail client self-service, gestion fiscale dynamique (Stripe Tax).", style_body))
    story.append(Paragraph("<b>• Règles strictes :</b> Conformité PCI-DSS SAQ-A intégrale (zéro carte sur serveur), validation obligatoire de la signature du webhook, recouvrement automatique des rejets (Dunning), test de transaction réelle à 1€ en live validé.", style_body))
    story.append(Paragraph("<b>• Valeur souhaitée :</b> Encaissement immédiat post-livraison, conversion de checkout > 85% via Apple Pay / Google Pay / CB.", style_body))

    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph("LIVRABLE #6 : DESIGN SYSTEM & DA HAUTE PRÉCISION (RÉF. WORK & CO / BRAUN)", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=3 * mm))
    story.append(Paragraph("<b>• Contenu exact :</b> Charte monochrome pure (7 nuances noir/zinc/blanc), tokens géométriques standardisés (rounded-xl, border-black/[0.08], shadow-xs), système à 3 voix (Geist Sans, JetBrains Mono, Serif Italique), composants accessibles.", style_body))
    story.append(Paragraph("<b>• Règles strictes :</b> Casse i18n naturelle (Sentence case dans les JSON, majuscules par classe CSS uppercase), contraste WCAG AAA (>7:1), touch targets 44x44px sur mobile, transitions douces sans rebond (cubic-bezier(0.16, 1, 0.3, 1)).", style_body))
    story.append(Paragraph("<b>• Valeur souhaitée :</b> Autorité institutionnelle immédiate, image de marque digne d'une valorisation à 8 chiffres.", style_body))
    story.append(PageBreak())

    # ── LIVRABLES 7 À 9 ET TABLEAU SYNTHÉTIQUE
    story.append(Paragraph("LIVRABLES #7 À #9 : QA, PASSATION LOOM & GARANTIE (RÉF. THOUGHTBOT / GOOGLE)", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=3 * mm))
    story.append(Paragraph("<b>• Livrable #7 (Harnais de Tests) :</b> Tests automatisés sur les flux critiques (RGPD, paiements, auth), couverture >80% sur la logique financière, zéro test intermittent. Valeur : Déploiement en production sans angoisse.", style_body))
    story.append(Paragraph("<b>• Livrable #8 (Passation Loom) :</b> Vidéo HD 20 min du Lead Architect décortiquant l'architecture, modèles DB, variables d'environnement + ARCHITECTURE.md. Valeur : Autonomie technique totale du client sans réunions chronophages.", style_body))
    story.append(Paragraph("<b>• Livrable #9 (Garantie 30 Jours) :</b> 30 jours calendaires d'assistance corrective intégrale sans frais, SLA de réponse <4h ouvrées sur canal direct. Valeur : Risque zéro pour le fondateur et les investisseurs.", style_body))

    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph("TABLEAU RÉCAPITULATIF DES STANDARDS & VALEUR CLIENT", style_h2))

    sum_data = [
        [Paragraph("Livrable Clé", style_th), Paragraph("Spécification Technique", style_th), Paragraph("Référence Marché", style_th), Paragraph("Valeur Stratégique", style_th)],
        [Paragraph("1. Dépôt GitHub", style_td_b), Paragraph("Repo privé, CI/CD, Conventional Commits", style_td), Paragraph("GitHub / Shopify", style_td), Paragraph("Onboarding CTO 15 min, Due Diligence", style_td)],
        [Paragraph("2. Socle Logiciel", style_td_b), Paragraph("Next.js App Router, Clean DDD, RSC purs", style_td), Paragraph("Linear / Basecamp", style_td), Paragraph("Fluidité 60fps, maintenance sans dette", style_td)],
        [Paragraph("3. Infra Edge", style_td_b), Paragraph("Vercel Anycast, Headers CSP/HSTS, WAF", style_td), Paragraph("Vercel / Cloudflare", style_td), Paragraph("0€ d'admin sys, disponibilité 99.99%", style_td)],
        [Paragraph("4. Base de Données", style_td_b), Paragraph("PostgreSQL 3NF, Migrations versionnées", style_td), Paragraph("Stripe / Supabase", style_td), Paragraph("Intégrité totale, scalabilité 500k users", style_td)],
        [Paragraph("5. Stripe Monétique", style_td_b), Paragraph("Abonnements, Webhooks, Customer Portal", style_td), Paragraph("Stripe Global", style_td), Paragraph("Encaissement immédiat, checkout 85%+", style_td)],
        [Paragraph("6. Design System", style_td_b), Paragraph("Monochrome pur, WCAG AAA, rounded-xl", style_td), Paragraph("Work & Co / Braun", style_td), Paragraph("Autorité haut de gamme, adoption fluide", style_td)],
        [Paragraph("7. Tests Automatisés", style_td_b), Paragraph("Couverture >80% sur flux critiques", style_td), Paragraph("Thoughtbot / Google", style_td), Paragraph("Zéro régression, sérénité des releases", style_td)],
        [Paragraph("8. Passation Loom", style_td_b), Paragraph("Vidéo 20 min architecte + README", style_td), Paragraph("Stripe Docs / Retool", style_td), Paragraph("Autonomie technique complète du client", style_td)],
        [Paragraph("9. Garantie 30 Jours", style_td_b), Paragraph("Assistance corrective SLA < 4h", style_td), Paragraph("Enterprise SLA", style_td), Paragraph("Élimination totale du risque d'exécution", style_td)]
    ]
    t_sum = Table(sum_data, colWidths=[30 * mm, 55 * mm, 35 * mm, 50 * mm])
    t_sum.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_BLACK),
        ('GRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_sum)

    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph("<b>LONSIDE STUDIO // MANUEL TECHNIQUE & CAHIER DES STANDARDS DE LIVRAISON — AVRIL 2026</b>", ParagraphStyle("Fin", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=8, textColor=C_BLACK)))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF Spécification Livrables généré : {output_path}")

if __name__ == "__main__":
    out_docs = os.path.join(os.path.dirname(__file__), "LONSIDE_SPECIFICATION_LIVRABLES_ET_STANDARDS_QUALITE.pdf")
    out_public = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "LONSIDE_SPECIFICATION_LIVRABLES_ET_STANDARDS_QUALITE.pdf")
    create_livrables_spec_pdf(out_docs)
    create_livrables_spec_pdf(out_public)

