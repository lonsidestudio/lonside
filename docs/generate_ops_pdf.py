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
        self.drawString(20 * mm, 282 * mm, "LONSIDE STUDIO  //  PLAN OPÉRATIONNEL & PACK DE LIVRAISON")
        self.drawRightString(190 * mm, 282 * mm, "GOUVERNANCE & INVESTISSEURS — AVRIL 2026")
        self.setStrokeColor(colors.HexColor("#e4e4e7"))
        self.setLineWidth(0.5)
        self.line(20 * mm, 280 * mm, 190 * mm, 280 * mm)

        # Pied de page
        self.line(20 * mm, 15 * mm, 190 * mm, 15 * mm)
        self.drawString(20 * mm, 11 * mm, "CONFIDENTIEL INTERNE — STUDIO D'INGÉNIERIE LOGICIELLE HAUTE VÉLOCITÉ")
        page_str = f"PAGE {self._pageNumber} / {page_count}"
        self.drawRightString(190 * mm, 11 * mm, page_str)
        self.restoreState()

def create_ops_pdf(output_path):
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
    style_sub = ParagraphStyle("Sub", parent=styles["Normal"], fontName="Helvetica", fontSize=12, leading=16, textColor=C_MUTED)
    style_h1 = ParagraphStyle("H1", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=14, leading=18, textColor=C_BLACK, spaceBefore=12, spaceAfter=6, keepWithNext=True)
    style_h2 = ParagraphStyle("H2", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=11, leading=14, textColor=C_DARK, spaceBefore=8, spaceAfter=4, keepWithNext=True)
    style_body = ParagraphStyle("Body", parent=styles["Normal"], fontName="Helvetica", fontSize=8.5, leading=12, textColor=C_BODY, spaceAfter=4)
    style_callout = ParagraphStyle("Call", parent=styles["Normal"], fontName="Helvetica", fontSize=8.5, leading=12, textColor=C_BODY)
    style_th = ParagraphStyle("TH", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=7.5, leading=9.5, textColor=colors.white)
    style_td = ParagraphStyle("TD", parent=styles["Normal"], fontName="Helvetica", fontSize=7.5, leading=10, textColor=C_BODY)
    style_td_b = ParagraphStyle("TDB", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=7.5, leading=10, textColor=C_BLACK)

    story = []

    # ── COUVERTURE
    story.append(Spacer(1, 25 * mm))
    story.append(Paragraph("LONSIDE STUDIO", style_brand))
    story.append(Spacer(1, 8 * mm))
    story.append(Paragraph("PLAN OPÉRATIONNEL & PACK DE LIVRAISON", style_title))
    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph("Manuel de Gouvernance Opérationnelle, Matrice RACI, Cadence des Sprints & Spécification des Livrables", style_sub))
    story.append(Spacer(1, 10 * mm))
    story.append(HRFlowable(width="100%", thickness=1.5, color=C_BLACK, spaceAfter=12 * mm))

    manifeste = """
    <b>Lonside Studio</b> opère sous la forme d'un <b>Atelier d'Ingénierie Haute Vélocité</b> : 
    un interlocuteur unique expérimenté (Lead Architect), des forfaits scellés dès 14 jours, 100% de cession de propriété intellectuelle sur GitHub 
    et une garantie contractuelle opposable avec pénalités de retard. Ce document interne synthétise l'ensemble de notre chaîne de valeur, nos matrices de responsabilités 
    et nos standards de livraison à l'attention de la Direction, des investisseurs et des CTOs partenaires.
    """
    call_table = Table([[Paragraph(manifeste, style_callout)]], colWidths=[170 * mm])
    call_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_SURFACE),
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('LEFTPADDING', (0,0), (-1,-1), 14),
        ('RIGHTPADDING', (0,0), (-1,-1), 14),
        ('TOPPADDING', (0,0), (-1,-1), 14),
        ('BOTTOMPADDING', (0,0), (-1,-1), 14),
    ]))
    story.append(call_table)

    story.append(Spacer(1, 20 * mm))

    meta_data = [
        [Paragraph("<b>Destinataires :</b> Direction, CTOs, Investisseurs", style_td), Paragraph("<b>Version :</b> 2.0 (High-Velocity Standard)", style_td)],
        [Paragraph("<b>Auteur :</b> Kevin T. (Directeur Opérationnel & DA)", style_td), Paragraph("<b>Date d'Effet :</b> Avril 2026", style_td)],
        [Paragraph("<b>Classification :</b> Confidentiel Interne / Investisseurs", style_td), Paragraph("<b>Périmètre :</b> Sprints Launch, Scale & Immersion", style_td)],
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

    # ── SECTION 1 : THÈSE STRATÉGIQUE
    story.append(Paragraph("1. THÈSE STRATÉGIQUE & MODÈLE OPÉRATIONNEL", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=4 * mm))
    story.append(Paragraph(
        "Lonside élimine la friction historique entre agences traditionnelles lentes et freelances isolés non-garantis. "
        "Notre modèle repose sur 5 piliers intransigeants :", style_body
    ))
    story.append(Paragraph("<b>• Zero Middleman :</b> Le client n'a qu'un interlocuteur : un Lead Architect chevronné avec plein pouvoir d'arbitrage technique.", style_body))
    story.append(Paragraph("<b>• Forfaits Scellés :</b> Aucun dépassement possible. Refus formel du TJM qui incite à la lenteur.", style_body))
    story.append(Paragraph("<b>• Zero Lock-In :</b> 100% du code source cédé sur le GitHub du client dès le jour de livraison.", style_body))
    story.append(Paragraph("<b>• Garantie 30 Jours :</b> Un mois d'assistance corrective gratuite post-mise en ligne.", style_body))
    story.append(Paragraph("<b>• Zero Data Retention :</b> Aucune donnée client n'est persistée ni réutilisée pour entraîner des IA publiques.", style_body))

    story.append(Spacer(1, 4 * mm))

    # ── SECTION 2 : RACI
    story.append(Paragraph("2. MATRICE DES PARTIES PRENANTES & GOUVERNANCE RACI", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=4 * mm))

    raci_data = [
        [Paragraph("Phase", style_th), Paragraph("Lead Architect (Lonside)", style_th), Paragraph("Client Founder / CPO", style_th), Paragraph("Client CTO / Tech Lead", style_th)],
        [Paragraph("Cadrage (J1-J2)", style_td_b), Paragraph("<b>Accountable (A)</b> : Verrouille CDC & Data", style_td), Paragraph("<b>Responsible (R)</b> : Valide objectifs", style_td), Paragraph("<b>Consulted (C)</b> : Contraintes infra", style_td)],
        [Paragraph("Sprint Actif (J3-J11)", style_td_b), Paragraph("<b>Responsible (R)</b> : Pilote l'assemblage", style_td), Paragraph("<b>Informed (I)</b> : Accès preview staging", style_td), Paragraph("<b>Consulted (C)</b> : Revue schémas DB", style_td)],
        [Paragraph("Recette (J12-J13)", style_td_b), Paragraph("<b>Responsible (R)</b> : Audit sécu & responsive", style_td), Paragraph("<b>Consulted (C)</b> : Retours finaux", style_td), Paragraph("<b>Accountable (A)</b> : Validation prod", style_td)],
        [Paragraph("Livraison (J14)", style_td_b), Paragraph("<b>Accountable (A)</b> : Transfert GitHub & Stripe", style_td), Paragraph("<b>Responsible (R)</b> : Lancement officiel", style_td), Paragraph("<b>Accountable (A)</b> : Réception IP tech", style_td)],
        [Paragraph("Garantie (J15-J45)", style_td_b), Paragraph("<b>Accountable (A)</b> : Correctifs SLA < 4h", style_td), Paragraph("<b>Informed (I)</b> : Statuts incidents", style_td), Paragraph("<b>Responsible (R)</b> : Signalement écarts", style_td)]
    ]
    t_raci = Table(raci_data, colWidths=[25 * mm, 50 * mm, 45 * mm, 50 * mm])
    t_raci.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_BLACK),
        ('GRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_raci)
    story.append(PageBreak())

    # ── SECTION 3 : OFFRES DU CATALOGUE
    story.append(Paragraph("3. DÉTAIL DES OFFRES DU CATALOGUE OPÉRATIONNEL", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=4 * mm))

    story.append(Paragraph("<b>Offre 1 : Sprint Launch — 6 900 € (14 Jours Ouvrés)</b>", style_h2))
    story.append(Paragraph("Mise en production clé-en-main d'une application web commerciale avec monétisation Stripe active en 14 jours.", style_body))

    launch_data = [
        [Paragraph("Jalon Chronologique", style_th), Paragraph("Actions Concrètes d'Ingénierie", style_th), Paragraph("Livrable Client Remis", style_th)],
        [Paragraph("Jours 1 — 2<br/>(Cadrage & Socle)", style_td_b), Paragraph("• Alignement objectifs & personas<br/>• Modélisation DB (PostgreSQL) & RBAC<br/>• Verrouillage périmètre contractuel", style_td), Paragraph("Cahier des charges scellé & Schéma de données validé", style_td)],
        [Paragraph("Jours 3 — 6<br/>(Front & Logique)", style_td_b), Paragraph("• Next.js App Router & Tailwind CSS<br/>• UI haute couture responsive 375px+<br/>• Authentification sécurisée OAuth/JWT", style_td), Paragraph("Staging actif en continu & Démo vidéo jalon", style_td)],
        [Paragraph("Jours 7 — 11<br/>(Stripe & APIs)", style_td_b), Paragraph("• Module Stripe complet (Abonnements/Paiements)<br/>• Webhooks idempotents & facturation<br/>• Connexion Resend & APIs externes", style_td), Paragraph("Tunnel de conversion & Flux métier testés", style_td)],
        [Paragraph("Jours 12 — 14<br/>(Mise en Ligne)", style_td_b), Paragraph("• Audits vitesse, SEO, RGPD ZDR<br/>• Cession organisation GitHub client<br/>• Enregistrement visite guidée Loom", style_td), Paragraph("Produit en production + Transfert GitHub + Loom", style_td)]
    ]
    t_launch = Table(launch_data, colWidths=[35 * mm, 80 * mm, 55 * mm])
    t_launch.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_DARK),
        ('GRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_launch)

    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph("<b>Offre 2 : Sprint Scale — 13 900 € (30 Jours Ouvrés)</b>", style_h2))
    story.append(Paragraph("Pour plateformes multi-acteurs (Marketplaces, SaaS B2B) nécessitant permissions fines, calculs automatisés en tâche de fond et haute résilience.", style_body))

    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph("<b>Offre 3 : Régie d'Immersion — Dès 5 500 € / mois</b>", style_h2))
    story.append(Paragraph("Intégration d'ingénieurs seniors dédiés dans le Slack du client, flexibilité mensuelle, semaine d'essai 5 jours.", style_body))
    story.append(PageBreak())

    # ── SECTION 4 : LE PACK DE LIVRAISON EXHAUSTIF
    story.append(Paragraph("4. LE PACK DE LIVRAISON EXHAUSTIF (WHAT WE DELIVER)", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=4 * mm))

    pack_data = [
        [Paragraph("Livrable Remis", style_th), Paragraph("Spécification Technique", style_th), Paragraph("Valeur Opérationnelle Client", style_th)],
        [Paragraph("1. Dépôt GitHub Cédé", style_td_b), Paragraph("Transfert officiel de propriété sur l'organisation client.", style_td), Paragraph("Indépendance absolue. Zéro dépendance.", style_td)],
        [Paragraph("2. Architecture Logicielle", style_td_b), Paragraph("Next.js 15+, TypeScript strict, Clean Architecture DDD.", style_td), Paragraph("Évolutivité fluide par tout profil senior.", style_td)],
        [Paragraph("3. CI/CD & Production", style_td_b), Paragraph("Workflows GitHub Actions, Vercel Edge, domaine DNS.", style_td), Paragraph("Déploiements automatisés sans interruption.", style_td)],
        [Paragraph("4. Base de Données", style_td_b), Paragraph("Schéma PostgreSQL normalisé, migrations versionnées.", style_td), Paragraph("Intégrité et sécurité des données métier.", style_td)],
        [Paragraph("5. Stripe Monétisation", style_td_b), Paragraph("Abonnements récurrents, portail client, webhooks.", style_td), Paragraph("Encaissement immédiat de vrais clients.", style_td)],
        [Paragraph("6. Tests Automatisés", style_td_b), Paragraph("Suites unitaires et intégration sur flux critiques.", style_td), Paragraph("Zéro régression lors des itérations futures.", style_td)],
        [Paragraph("7. Walkthrough Loom", style_td_b), Paragraph("Vidéo 20 min commentée par le Lead Architect.", style_td), Paragraph("Onboarding technique instantané du CTO.", style_td)],
        [Paragraph("8. Garantie 30 Jours", style_td_b), Paragraph("Assistance corrective intégrale avec SLA < 4h.", style_td), Paragraph("Sérénité post-lancement sans surcoût.", style_td)]
    ]
    t_pack = Table(pack_data, colWidths=[35 * mm, 75 * mm, 60 * mm])
    t_pack.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_BLACK),
        ('GRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_pack)

    story.append(Spacer(1, 4 * mm))

    # ── SECTION 5 : GESTION DES RISQUES & ENGAGEMENT FINANCIER
    story.append(Paragraph("5. GESTION DES RISQUES & ENGAGEMENT FINANCIER", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_BORDER, spaceAfter=4 * mm))
    story.append(Paragraph("<b>• Scope Creep Arbitré :</b> Toute demande hors périmètre scellé est basculée en V2 pour sanctuariser la date de livraison.", style_body))
    story.append(Paragraph("<b>• Pénalités de Retard :</b> Pénalités journalières contractuelles déduites de la facture en cas de retard imputable au studio.", style_body))
    story.append(Paragraph("<b>• Résilience des Dépendances :</b> Architecture modulaire avec mocks de secours pour pallier toute panne tierce.", style_body))
    story.append(Paragraph("<b>• Confidentialité ZDR :</b> Chiffrement de bout en bout, zéro rétention de code sur modèles publics.", style_body))

    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph("<b>LONSIDE STUDIO // DIRECTION GÉNÉRALE & DIRECTION OPÉRATIONNELLE — AVRIL 2026</b>", ParagraphStyle("Fin", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=8, textColor=C_BLACK)))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF Opérationnel généré : {output_path}")

if __name__ == "__main__":
    out_docs = os.path.join(os.path.dirname(__file__), "LONSIDE_PLAN_OPERATIONNEL_ET_PACK_LIVRAISON.pdf")
    out_public = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "LONSIDE_PLAN_OPERATIONNEL_ET_PACK_LIVRAISON.pdf")
    create_ops_pdf(out_docs)
    create_ops_pdf(out_public)
