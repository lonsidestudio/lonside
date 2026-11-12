import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_deck(output_pptx):
    prs = Presentation()
    # 16:9 Widescreen standard
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6] # Blank slide layout

    # Colors
    c_black = RGBColor(9, 9, 11)       # #09090b
    c_dark = RGBColor(24, 24, 27)      # #18181b
    c_gray = RGBColor(113, 113, 122)   # #71717a
    c_light_gray = RGBColor(161, 161, 170)
    c_card_bg = RGBColor(250, 250, 250)
    c_card_border = RGBColor(228, 228, 231)
    c_white = RGBColor(255, 255, 255)

    def add_card(slide, left, top, width, height, bg_color=c_card_bg, border_color=c_card_border):
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = bg_color
        shape.line.color.rgb = border_color
        shape.line.width = Pt(1.5)
        return shape

    def add_badge(slide, left, top, text, width=Inches(2.2), height=Inches(0.4), bg_color=c_black, text_color=c_white):
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        badge.fill.solid()
        badge.fill.fore_color.rgb = bg_color
        badge.line.fill.background()
        tf = badge.text_frame
        tf.word_wrap = False
        p = tf.paragraphs[0]
        p.text = text
        p.alignment = PP_ALIGN.CENTER
        p.font.name = "Inter"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = text_color
        return badge

    def add_header(slide, tag_text, title_text, sub_text=None):
        # Tag
        tx_tag = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.5), Inches(0.3))
        p_tag = tx_tag.text_frame.paragraphs[0]
        p_tag.text = tag_text.upper()
        p_tag.font.name = "Inter"
        p_tag.font.size = Pt(11)
        p_tag.font.bold = True
        p_tag.font.color.rgb = c_gray

        # Title
        tx_title = slide.shapes.add_textbox(Inches(0.8), Inches(0.8), Inches(11.5), Inches(0.6))
        p_title = tx_title.text_frame.paragraphs[0]
        p_title.text = title_text
        p_title.font.name = "Inter"
        p_title.font.size = Pt(26)
        p_title.font.bold = True
        p_title.font.color.rgb = c_black

        # Subtitle if present
        if sub_text:
            tx_sub = slide.shapes.add_textbox(Inches(0.8), Inches(1.4), Inches(11.5), Inches(0.4))
            p_sub = tx_sub.text_frame.paragraphs[0]
            p_sub.text = sub_text
            p_sub.font.name = "Inter"
            p_sub.font.size = Pt(14)
            p_sub.font.color.rgb = c_gray

    # ==========================================
    # SLIDE 1 : COVER
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    
    # Big Title Box
    tx1 = s1.shapes.add_textbox(Inches(1.0), Inches(1.6), Inches(11.0), Inches(4.5))
    tf1 = tx1.text_frame
    tf1.word_wrap = True

    p0 = tf1.paragraphs[0]
    p0.text = "lonside."
    p0.font.name = "Inter"
    p0.font.size = Pt(72)
    p0.font.bold = True
    p0.font.color.rgb = c_black

    p1 = tf1.add_paragraph()
    p1.text = "Crafting Digital Sovereignty."
    p1.font.name = "Inter"
    p1.font.size = Pt(36)
    p1.font.bold = True
    p1.font.color.rgb = c_dark
    p1.space_before = Pt(20)

    p2 = tf1.add_paragraph()
    p2.text = "Portfolio de services d'ingénierie logicielle & standards architecturaux"
    p2.font.name = "Inter"
    p2.font.size = Pt(18)
    p2.font.color.rgb = c_gray
    p2.space_before = Pt(10)

    # Badges at bottom
    add_badge(s1, Inches(1.0), Inches(5.8), "NEXT.JS 14 APP ROUTER", width=Inches(2.5))
    add_badge(s1, Inches(3.7), Inches(5.8), "SCORE LIGHTHOUSE 4×95+", width=Inches(2.6))
    add_badge(s1, Inches(6.5), Inches(5.8), "POUR DÉCIDEURS EXIGEANTS", width=Inches(2.7), bg_color=c_card_border, text_color=c_black)

    # ==========================================
    # SLIDE 2 : LE MANIFESTE BÂTISSEUR
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    add_header(s2, "01 / Notre Conviction", "Le coût caché de la médiocrité technique", "Pourquoi les solutions hâtives détruisent la valeur et freinent la croissance.")

    # Big Quote Card
    q_card = add_card(s2, Inches(0.8), Inches(1.9), Inches(11.7), Inches(1.8), bg_color=c_black, border_color=c_black)
    tx_q = s2.shapes.add_textbox(Inches(1.2), Inches(2.1), Inches(10.9), Inches(1.4))
    tf_q = tx_q.text_frame
    tf_q.word_wrap = True
    pq = tf_q.paragraphs[0]
    pq.text = "« 80% des produits digitaux échouent par asphyxie sous le poids d'une dette technique invisible, d'une lenteur de chargement excessive et d'un design sans âme. »"
    pq.font.name = "Inter"
    pq.font.size = Pt(20)
    pq.font.bold = True
    pq.font.color.rgb = c_white

    # 2 Comparison Columns
    # Left Column: Ce que font les agences classiques
    c_left = add_card(s2, Inches(0.8), Inches(4.0), Inches(5.7), Inches(2.8))
    tx_cl = s2.shapes.add_textbox(Inches(1.0), Inches(4.2), Inches(5.3), Inches(2.4))
    tf_cl = tx_cl.text_frame
    tf_cl.word_wrap = True
    pcl_h = tf_cl.paragraphs[0]
    pcl_h.text = "L'Approche Agence Classique"
    pcl_h.font.name = "Inter"
    pcl_h.font.size = Pt(18)
    pcl_h.font.bold = True
    pcl_h.font.color.rgb = c_black

    pcl_b = tf_cl.add_paragraph()
    pcl_b.text = "• Facturation au temps passé créant des retards structurels\n• Réunions de cadrage hebdomadaires sans valeur concrète\n• Développements sous-traités à des profils juniors\n• Templates génériques et scores Lighthouse < 60\n• Dépendance technique et dette masquée à la livraison"
    pcl_b.font.name = "Inter"
    pcl_b.font.size = Pt(13)
    pcl_b.font.color.rgb = c_dark
    pcl_b.space_before = Pt(8)

    # Right Column: La méthode Lonside
    c_right = add_card(s2, Inches(6.8), Inches(4.0), Inches(5.7), Inches(2.8))
    tx_cr = s2.shapes.add_textbox(Inches(7.0), Inches(4.2), Inches(5.3), Inches(2.4))
    tf_cr = tx_cr.text_frame
    tf_cr.word_wrap = True
    pcr_h = tf_cr.paragraphs[0]
    pcr_h.text = "La Méthode Commando Lonside"
    pcr_h.font.name = "Inter"
    pcr_h.font.size = Pt(18)
    pcr_h.font.bold = True
    pcr_h.font.color.rgb = c_black

    pcr_b = tf_cr.add_paragraph()
    pcr_b.text = "• Forfaits fermes et délais chirurgicaux (14j / 30j)\n• Binôme Senior dédié (Lead Tech + Head of Product)\n• Next.js 14, TypeScript strict, zéro 'any', zéro dette\n• Score Lighthouse 4×95+ certifié avant mise en ligne\n• Transfert total de propriété et autonomie d'équipe"
    pcr_b.font.name = "Inter"
    pcr_b.font.size = Pt(13)
    pcr_b.font.color.rgb = c_dark
    pcr_b.space_before = Pt(8)

    # ==========================================
    # SLIDE 3 : ARCHITECTURE DE MARQUE & FLYWHEEL
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    add_header(s3, "02 / Structure de Marque", "L'Alliance de l'Ingénierie Logicielle et du Média Bâtisseurs", "Une marque ombrelle unissant deux piliers aux synergies industrielles directes.")

    diag_arch = "docs/diagram_brand_architecture.png"
    if os.path.exists(diag_arch):
        s3.shapes.add_picture(diag_arch, Inches(0.8), Inches(2.0), width=Inches(11.7))

    # ==========================================
    # SLIDE 4 : OFFRE #1 - SPRINT LAUNCH (14 JOURS)
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    add_header(s4, "03 / Offre de Service #1", "Sprint Launch : De l'idée au live en 14 jours ouvrés", "Conçu pour les startups pre-seed/seed et les PME voulant tester un marché sans inertie.")

    # 3 Cards
    w_card = Inches(3.7)
    h_card = Inches(4.9)
    y_card = Inches(2.0)

    # Card 1: Périmètre
    c1 = add_card(s4, Inches(0.8), y_card, w_card, h_card)
    tx_c1 = s4.shapes.add_textbox(Inches(1.0), y_card + Inches(0.2), w_card - Inches(0.4), h_card - Inches(0.4))
    tf1 = tx_c1.text_frame
    tf1.word_wrap = True
    p1_h = tf1.paragraphs[0]
    p1_h.text = "Périmètre Strict"
    p1_h.font.name = "Inter"
    p1_h.font.size = Pt(18)
    p1_h.font.bold = True
    p1_h.font.color.rgb = c_black

    p1_b = tf1.add_paragraph()
    p1_b.text = "• 1 à 3 pages stratégiques complètes\n  (Landing page conversion + Produit + Booking)\n• Next.js 14 App Router + Tailwind CSS\n• Typographie haute couture (Inter & Geist)\n• Micro-interactions & animations soignées\n• Formulaires de conversion optimisés"
    p1_b.font.name = "Inter"
    p1_b.font.size = Pt(13)
    p1_b.font.color.rgb = c_dark
    p1_b.space_before = Pt(10)

    # Card 2: Standards Inviolables
    c2 = add_card(s4, Inches(4.8), y_card, w_card, h_card)
    tx_c2 = s4.shapes.add_textbox(Inches(5.0), y_card + Inches(0.2), w_card - Inches(0.4), h_card - Inches(0.4))
    tf2 = tx_c2.text_frame
    tf2.word_wrap = True
    p2_h = tf2.paragraphs[0]
    p2_h.text = "Standards Techniques"
    p2_h.font.name = "Inter"
    p2_h.font.size = Pt(18)
    p2_h.font.bold = True
    p2_h.font.color.rgb = c_black

    p2_b = tf2.add_paragraph()
    p2_b.text = "• Score Lighthouse 4×95+ garanti\n• TypeScript strict (zéro 'any')\n• Zéro dépendances circulaires\n• Accessibilité WCAG 2.1 AA intégrée\n• Déploiement CI/CD Vercel automatisé\n• Configuration DNS & sécurité HTTPS"
    p2_b.font.name = "Inter"
    p2_b.font.size = Pt(13)
    p2_b.font.color.rgb = c_dark
    p2_b.space_before = Pt(10)

    # Card 3: Résultat & ROI Client
    c3 = add_card(s4, Inches(8.8), y_card, w_card, h_card)
    tx_c3 = s4.shapes.add_textbox(Inches(9.0), y_card + Inches(0.2), w_card - Inches(0.4), h_card - Inches(0.4))
    tf3 = tx_c3.text_frame
    tf3.word_wrap = True
    p3_h = tf3.paragraphs[0]
    p3_h.text = "Résultats & ROI Client"
    p3_h.font.name = "Inter"
    p3_h.font.size = Pt(18)
    p3_h.font.bold = True
    p3_h.font.color.rgb = c_black

    p3_b = tf3.add_paragraph()
    p3_b.text = "• Time-to-market divisé par 4\n• Taux de conversion moyen : +40% à +85%\n• Crédibilité immédiate auprès des fonds & clients\n• Vitesse LCP < 1.0s sur mobile\n• Forfait ferme sans mauvaise surprise"
    p3_b.font.name = "Inter"
    p3_b.font.size = Pt(13)
    p3_b.font.color.rgb = c_dark
    p3_b.space_before = Pt(10)

    # ==========================================
    # SLIDE 5 : OFFRE #2 - SPRINT SCALE (30 JOURS)
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    add_header(s5, "04 / Offre de Service #2", "Sprint Scale : L'infrastructure logicielle haute performance", "Pour les plateformes SaaS, scale-ups et entreprises nécessitant des flux dynamiques complexes.")

    # Card 1: Périmètre
    c5_1 = add_card(s5, Inches(0.8), y_card, w_card, h_card)
    tx_c5_1 = s5.shapes.add_textbox(Inches(1.0), y_card + Inches(0.2), w_card - Inches(0.4), h_card - Inches(0.4))
    tf5_1 = tx_c5_1.text_frame
    tf5_1.word_wrap = True
    p5_1_h = tf5_1.paragraphs[0]
    p5_1_h.text = "Périmètre Élargi"
    p5_1_h.font.name = "Inter"
    p5_1_h.font.size = Pt(18)
    p5_1_h.font.bold = True
    p5_1_h.font.color.rgb = c_black

    p5_1_b = tf5_1.add_paragraph()
    p5_1_b.text = "• Jusqu'à 7 écrans applicatifs dynamiques\n• Tableaux de bord & visualisations complexes\n• Authentification sécurisée (NextAuth / JWT)\n• Intégration Stripe Billing & abonnements\n• Gestionnaire de données & filtres temps réel"
    p5_1_b.font.name = "Inter"
    p5_1_b.font.size = Pt(13)
    p5_1_b.font.color.rgb = c_dark
    p5_1_b.space_before = Pt(10)

    # Card 2: Standards
    c5_2 = add_card(s5, Inches(4.8), y_card, w_card, h_card)
    tx_c5_2 = s5.shapes.add_textbox(Inches(5.0), y_card + Inches(0.2), w_card - Inches(0.4), h_card - Inches(0.4))
    tf5_2 = tx_c5_2.text_frame
    tf5_2.word_wrap = True
    p5_2_h = tf5_2.paragraphs[0]
    p5_2_h.text = "Robustesse & Tests"
    p5_2_h.font.name = "Inter"
    p5_2_h.font.size = Pt(18)
    p5_2_h.font.bold = True
    p5_2_h.font.color.rgb = c_black

    p5_2_b = tf5_2.add_paragraph()
    p5_2_b.text = "• Internationalisation native multilingue\n• Suite de tests automatisés (Vitest unitaire)\n• Tests E2E de bout en bout (Playwright)\n• Gestion optimiste du cache (Apollo / TanStack)\n• Architecture modulaire DDD"
    p5_2_b.font.name = "Inter"
    p5_2_b.font.size = Pt(13)
    p5_2_b.font.color.rgb = c_dark
    p5_2_b.space_before = Pt(10)

    # Card 3: Résultat
    c5_3 = add_card(s5, Inches(8.8), y_card, w_card, h_card)
    tx_c5_3 = s5.shapes.add_textbox(Inches(9.0), y_card + Inches(0.2), w_card - Inches(0.4), h_card - Inches(0.4))
    tf5_3 = tx_c5_3.text_frame
    tf5_3.word_wrap = True
    p5_3_h = tf5_3.paragraphs[0]
    p5_3_h.text = "Résultats & ROI Client"
    p5_3_h.font.name = "Inter"
    p5_3_h.font.size = Pt(18)
    p5_3_h.font.bold = True
    p5_3_h.font.color.rgb = c_black

    p5_3_b = tf5_3.add_paragraph()
    p5_3_b.text = "• Scalabilité éprouvée (100k visites/jour)\n• Taux de rebond moyen < 25%\n• Paiements sans accroc ni churn d'onboarding\n• Zéro refonte requise lors de la montée en charge\n• Documentation technique complète livrée"
    p5_3_b.font.name = "Inter"
    p5_3_b.font.size = Pt(13)
    p5_3_b.font.color.rgb = c_dark
    p5_3_b.space_before = Pt(10)

    # ==========================================
    # SLIDE 6 : OFFRE #3 - IMMERSION SQUAD (RÉGIE SENIOR)
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    add_header(s6, "05 / Offre de Service #3", "Immersion Squad : Le binôme senior greffé à votre équipe", "Pour les entreprises technologiques cherchant à accélérer sans recruter à l'aveugle.")

    # Card 1: Profil
    c6_1 = add_card(s6, Inches(0.8), y_card, w_card, h_card)
    tx_c6_1 = s6.shapes.add_textbox(Inches(1.0), y_card + Inches(0.2), w_card - Inches(0.4), h_card - Inches(0.4))
    tf6_1 = tx_c6_1.text_frame
    tf6_1.word_wrap = True
    p6_1_h = tf6_1.paragraphs[0]
    p6_1_h.text = "Le Binôme Dédié"
    p6_1_h.font.name = "Inter"
    p6_1_h.font.size = Pt(18)
    p6_1_h.font.bold = True
    p6_1_h.font.color.rgb = c_black

    p6_1_b = tf6_1.add_paragraph()
    p6_1_b.text = "• 1 Lead Tech / Architecte Logiciel Senior\n• 1 Head of Product / Designer Senior\n• Disponibilité intégrale sur votre Slack/Teams\n• Immersion trimestrielle ou semestrielle\n• Engagement contractuel de délivrabilité"
    p6_1_b.font.name = "Inter"
    p6_1_b.font.size = Pt(13)
    p6_1_b.font.color.rgb = c_dark
    p6_1_b.space_before = Pt(10)

    # Card 2: Méthode
    c6_2 = add_card(s6, Inches(4.8), y_card, w_card, h_card)
    tx_c6_2 = s6.shapes.add_textbox(Inches(5.0), y_card + Inches(0.2), w_card - Inches(0.4), h_card - Inches(0.4))
    tf6_2 = tx_c6_2.text_frame
    tf6_2.word_wrap = True
    p6_2_h = tf6_2.paragraphs[0]
    p6_2_h.text = "Méthode Sans Friction"
    p6_2_h.font.name = "Inter"
    p6_2_h.font.size = Pt(18)
    p6_2_h.font.bold = True
    p6_2_h.font.color.rgb = c_black

    p6_2_b = tf6_2.add_paragraph()
    p6_2_b.text = "• 2 cycles de releases en production / semaine\n• Zéro réunion superflue (communication asynchrone)\n• Refonte complète de Design System\n• Résolution des goulets d'étranglement critiques\n• Mentoring actif des développeurs internes"
    p6_2_b.font.name = "Inter"
    p6_2_b.font.size = Pt(13)
    p6_2_b.font.color.rgb = c_dark
    p6_2_b.space_before = Pt(10)

    # Card 3: Résultat
    c6_3 = add_card(s6, Inches(8.8), y_card, w_card, h_card)
    tx_c6_3 = s6.shapes.add_textbox(Inches(9.0), y_card + Inches(0.2), w_card - Inches(0.4), h_card - Inches(0.4))
    tf6_3 = tx_c6_3.text_frame
    tf6_3.word_wrap = True
    p6_3_h = tf6_3.paragraphs[0]
    p6_3_h.text = "Résultats & ROI Client"
    p6_3_h.font.name = "Inter"
    p6_3_h.font.size = Pt(18)
    p6_3_h.font.bold = True
    p6_3_h.font.color.rgb = c_black

    p6_3_b = tf6_3.add_paragraph()
    p6_3_b.text = "• Vélocité d'équipe multipliée par 2 (+120%)\n• Dette technique divisée par 3 en 90 jours\n• Coût inférieur à un double recrutement senior en CDI\n• Flexibilité totale de reconduction\n• Élimination des bugs bloquants en production"
    p6_3_b.font.name = "Inter"
    p6_3_b.font.size = Pt(13)
    p6_3_b.font.color.rgb = c_dark
    p6_3_b.space_before = Pt(10)

    # ==========================================
    # SLIDE 7 : ROADMAP TRIENNALE (2027 – 2029+)
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    add_header(s7, "06 / Trajectoire Stratégique", "Roadmap Triennale : La stratégie de développement progressive", "Comment nous capitalisons chaque euro et chaque ligne de code pour bâtir un groupe pérenne.")

    diag_road = "docs/diagram_roadmap_timeline.png"
    if os.path.exists(diag_road):
        s7.shapes.add_picture(diag_road, Inches(0.8), Inches(2.0), width=Inches(11.7))

    # ==========================================
    # SLIDE 8 : BACK COVER & PRISE DE CONTACT
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    
    c8 = add_card(s8, Inches(0.8), Inches(1.0), Inches(11.7), Inches(5.5), bg_color=c_black, border_color=c_black)
    
    tx8 = s8.shapes.add_textbox(Inches(1.5), Inches(1.8), Inches(10.3), Inches(4.0))
    tf8 = tx8.text_frame
    tf8.word_wrap = True

    p8_0 = tf8.paragraphs[0]
    p8_0.text = "lonside."
    p8_0.font.name = "Inter"
    p8_0.font.size = Pt(48)
    p8_0.font.bold = True
    p8_0.font.color.rgb = c_white

    p8_1 = tf8.add_paragraph()
    p8_1.text = "Construisons votre avantage compétitif."
    p8_1.font.name = "Inter"
    p8_1.font.size = Pt(28)
    p8_1.font.bold = True
    p8_1.font.color.rgb = c_white
    p8_1.space_before = Pt(15)

    p8_2 = tf8.add_paragraph()
    p8_2.text = "Nous n'acceptons que 3 projets simultanés pour garantir une attention chirurgicale à chaque ligne de code et chaque pixel livré."
    p8_2.font.name = "Inter"
    p8_2.font.size = Pt(16)
    p8_2.font.color.rgb = c_light_gray
    p8_2.space_before = Pt(10)

    p8_3 = tf8.add_paragraph()
    p8_3.text = "RÉSERVEZ VOTRE DIAGNOSTIC D'ARCHITECTURE PRIVÉ (30 MIN) : CONTACT@LONSIDE.COM"
    p8_3.font.name = "Inter"
    p8_3.font.size = Pt(14)
    p8_3.font.bold = True
    p8_3.font.color.rgb = c_white
    p8_3.space_before = Pt(30)

    prs.save(output_pptx)
    print(f"Deck PowerPoint généré : {output_pptx}")

if __name__ == "__main__":
    os.makedirs("docs", exist_ok=True)
    os.makedirs("public", exist_ok=True)
    create_deck("docs/LONSIDE_OFFRE_SERVICES_CLIENT_DECK.pptx")
    create_deck("public/LONSIDE_OFFRE_SERVICES_CLIENT_DECK.pptx")

