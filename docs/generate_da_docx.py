import os
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, hex_color):
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=140, bottom=140, left=200, right=200):
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def set_cell_border(cell, **kwargs):
    """
    kwargs: top, bottom, left, right
    values: dict(val='single', sz='4', color='E4E4E7')
    """
    tcPr = cell._element.get_or_add_tcPr()
    tcBorders = parse_xml(f'<w:tcBorders {nsdecls("w")}/>')
    for edge in ('top', 'left', 'bottom', 'right'):
        edge_data = kwargs.get(edge)
        if edge_data:
            b_elm = parse_xml(f'<w:{edge} {nsdecls("w")} w:val="{edge_data.get("val", "single")}" w:sz="{edge_data.get("sz", "4")}" w:space="0" w:color="{edge_data.get("color", "E4E4E7")}"/>')
            tcBorders.append(b_elm)
        else:
            b_elm = parse_xml(f'<w:{edge} {nsdecls("w")} w:val="none"/>')
            tcBorders.append(b_elm)
    tcPr.append(tcBorders)

def build_lonside_da_docx(output_path):
    doc = Document()

    # Configuration des marges (2 cm partout)
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # Couleurs de la charte monochrome Lonside
    COLOR_BLACK = RGBColor(9, 9, 11)      # #09090b
    COLOR_DARK = RGBColor(24, 24, 27)     # #18181b
    COLOR_BODY = RGBColor(39, 39, 42)     # #27272a
    COLOR_MUTED = RGBColor(113, 113, 122) # #71717a

    # ──────────────────────────────────────────────────────────────────────────
    # COUVERTURE ÉDITORIALE HAUTE COUTURE
    # ──────────────────────────────────────────────────────────────────────────
    p_brand = doc.add_paragraph()
    p_brand.paragraph_format.space_before = Pt(40)
    p_brand.paragraph_format.space_after = Pt(12)
    run_brand = p_brand.add_run("LONSIDE STUDIO")
    run_brand.font.name = "Arial"
    run_brand.font.size = Pt(11)
    run_brand.font.bold = True
    run_brand.font.color.rgb = COLOR_MUTED

    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(8)
    run_title = p_title.add_run("DIRECTION ARTISTIQUE\n& DESIGN SYSTEM")
    run_title.font.name = "Arial"
    run_title.font.size = Pt(30)
    run_title.font.bold = True
    run_title.font.color.rgb = COLOR_BLACK

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(24)
    run_sub = p_sub.add_run("Le Manuel de Référence Graphique, Typographique et d'Interaction")
    run_sub.font.name = "Arial"
    run_sub.font.size = Pt(13)
    run_sub.font.color.rgb = COLOR_MUTED

    # Bloc Manifeste Encadré
    tbl_callout = doc.add_table(rows=1, cols=1)
    tbl_callout.alignment = WD_TABLE_ALIGNMENT.CENTER
    c = tbl_callout.cell(0, 0)
    c.width = Inches(6.8)
    set_cell_background(c, "FAFAFA")
    set_cell_margins(c, top=200, bottom=200, left=240, right=240)
    set_cell_border(c, top=dict(color="E4E4E7", sz="6"), bottom=dict(color="E4E4E7", sz="6"),
                       left=dict(color="E4E4E7", sz="6"), right=dict(color="E4E4E7", sz="6"))
    
    p_call = c.paragraphs[0]
    p_call.paragraph_format.space_after = Pt(0)
    r1 = p_call.add_run("Lonside Studio ")
    r1.font.bold = True
    r1.font.size = Pt(10)
    r1.font.color.rgb = COLOR_BLACK
    r2 = p_call.add_run(
        "incarne l'antithèse du bruit visuel et des tendances éphémères. Inspirée des standards de rigueur des plus grands studios mondiaux "
        "(Linear, Stripe Press, Work & Co, Braun / Dieter Rams), notre identité repose sur un principe fondateur : "
    )
    r2.font.size = Pt(10)
    r2.font.color.rgb = COLOR_BODY
    r3 = p_call.add_run("l'extrême précision technique au service d'une clarté absolue. ")
    r3.font.bold = True
    r3.font.size = Pt(10)
    r3.font.color.rgb = COLOR_BLACK
    r4 = p_call.add_run(
        "Ce document formalise chaque règle chromatique, typographique, géométrique et dynamique qui constitue la signature Lonside."
    )
    r4.font.size = Pt(10)
    r4.font.color.rgb = COLOR_BODY

    # Métadonnées du document
    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_before = Pt(30)

    tbl_meta = doc.add_table(rows=3, cols=2)
    tbl_meta.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_rows = [
        [("Statut :", " Officiel & Validé"), ("Version :", " 2.0 (High-Precision)")],
        [("Rôle Éditeur :", " Directeur Artistique & Lead Architecte"), ("Date d'Effet :", " Avril 2026")],
        [("Périmètre :", " Web, Plateforme, Documents & Mobile"), ("Classification :", " Production Ready")]
    ]
    for r_idx, row_data in enumerate(meta_rows):
        for c_idx, (k, v) in enumerate(row_data):
            cell = tbl_meta.cell(r_idx, c_idx)
            cell.width = Inches(3.4)
            set_cell_margins(cell, top=60, bottom=60, left=0, right=0)
            set_cell_border(cell, top=dict(color="E4E4E7", sz="4") if r_idx == 0 else None,
                               bottom=dict(color="E4E4E7", sz="4") if r_idx == 2 else None)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            rk = p.add_run(k)
            rk.font.bold = True
            rk.font.size = Pt(9)
            rk.font.color.rgb = COLOR_BLACK
            rv = p.add_run(v)
            rv.font.size = Pt(9)
            rv.font.color.rgb = COLOR_MUTED

    doc.add_page_break()

    # ──────────────────────────────────────────────────────────────────────────
    # SECTION 1 : VISION & PHILOSOPHIE DE MARQUE
    # ──────────────────────────────────────────────────────────────────────────
    h1 = doc.add_heading(level=1)
    run_h1 = h1.add_run("I. VISION & PHILOSOPHIE DE MARQUE")
    run_h1.font.name = "Arial"
    run_h1.font.size = Pt(16)
    run_h1.font.bold = True
    run_h1.font.color.rgb = COLOR_BLACK

    p_intro = doc.add_paragraph()
    p_intro.paragraph_format.space_after = Pt(12)
    p_intro.add_run(
        "Lonside se positionne comme un studio d'ingénierie logicielle haut de gamme, conjuguant la vélocité extrême "
        "(livraisons en sprints fermes dès 14 jours) et la noblesse d'un produit conçu pour durer. "
        "Notre direction artistique évite tout artifice gratuit pour se concentrer sur l'essentiel : "
        "la lisibilité, la hiérarchie chirurgicale de l'information et le respect du temps de nos interlocuteurs."
    ).font.color.rgb = COLOR_BODY

    pillars = [
        ("Monochrome Haute Couture", "Une palette exclusivement composée de noir minéral (#09090b), de zincs gradués et de blanc pur. Zéro couleur d'accent gadget (pas de violet, bleu criard ou dégradés saturés). L'élégance naît de la nuance."),
        ("Rigueur Mathématique & Précision Métrique", "Chaque proportion est calculée. L'information s'ordonne par métriques concrètes (jours ouvrés garantis, pourcentages d'accélération, forfaits fermes sans dépassement)."),
        ("Zéro Superflu, Zéro Bruit Visuel", "Chaque composant présent à l'écran a une fonction opérationnelle univoque. Suppression impérative de tout élément décoratif inutile ou distrayant."),
        ("Contraste & Respiration Spatiale", "Des espacements généreux (paddings amples, interlignages aérés) qui confèrent une sérénité luxueuse et éliminent toute sensation d'étouffement ou d'urgence agressive.")
    ]

    for p_title_text, p_desc_text in pillars:
        p_pill = doc.add_paragraph()
        p_pill.paragraph_format.space_before = Pt(6)
        p_pill.paragraph_format.space_after = Pt(4)
        run_pt = p_pill.add_run(f"• {p_title_text} : ")
        run_pt.font.bold = True
        run_pt.font.size = Pt(10)
        run_pt.font.color.rgb = COLOR_BLACK
        run_pd = p_pill.add_run(p_desc_text)
        run_pd.font.size = Pt(10)
        run_pd.font.color.rgb = COLOR_BODY

    doc.add_page_break()

    # ──────────────────────────────────────────────────────────────────────────
    # SECTION 2 : PALETTE CHROMATIQUE MONOCHROME PURE
    # ──────────────────────────────────────────────────────────────────────────
    h2 = doc.add_heading(level=1)
    run_h2 = h2.add_run("II. PALETTE CHROMATIQUE MONOCHROME PURE")
    run_h2.font.name = "Arial"
    run_h2.font.size = Pt(16)
    run_h2.font.bold = True
    run_h2.font.color.rgb = COLOR_BLACK

    p_pal_intro = doc.add_paragraph()
    p_pal_intro.paragraph_format.space_after = Pt(12)
    p_pal_intro.add_run(
        "La charte chromatique de Lonside est fondée sur une rigueur monochrome absolue. "
        "Elle respecte les normes d'accessibilité WCAG 2.1 niveau AAA avec un contraste texte/fond systématiquement supérieur à 7:1."
    ).font.color.rgb = COLOR_BODY

    # Tableau chromatique
    tbl_colors = doc.add_table(rows=1, cols=5)
    tbl_colors.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers = ["Nom de Nuance", "Code Hex", "Code RGB", "Rôle & Utilisation", "Ratio WCAG"]
    for idx, text in enumerate(headers):
        cell = tbl_colors.cell(0, idx)
        set_cell_background(cell, "09090B")
        set_cell_margins(cell, top=100, bottom=100, left=100, right=100)
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        run = p.add_run(text)
        run.font.bold = True
        run.font.size = Pt(8.5)
        run.font.color.rgb = RGBColor(255, 255, 255)

    color_rows = [
        ("Noir Minéral", "#09090b", "rgb(9, 9, 11)", "Fond boutons primaires, textes majeurs H1/H2, logo", "20.5:1 (AAA)"),
        ("Zinc Graphite", "#18181b", "rgb(24, 24, 27)", "Titres secondaires H3, badges sombres, focus rings", "18.2:1 (AAA)"),
        ("Zinc Texte", "#27272a", "rgb(39, 39, 42)", "Corps de texte principal, listes et descriptions denses", "14.1:1 (AAA)"),
        ("Zinc Muted", "#71717a", "rgb(113, 113, 122)", "Libellés secondaires, timestamps, indicateurs monospaces", "4.6:1 (AA)"),
        ("Bordure Fine", "#e4e4e7", "rgb(228, 228, 231)", "Lignes de démarcation, contours de cartes (opacité 8%)", "Contour net"),
        ("Fond Neige", "#fafafa", "rgb(250, 250, 250)", "Surfaces de cartes primaires, cartouches d'immersion", "Fond reposant"),
        ("Blanc Pur", "#ffffff", "rgb(255, 255, 255)", "Arrière-plan global, cartes surélevées, texte sur noir", "Fond lumière")
    ]

    for row_data in color_rows:
        row_cells = tbl_colors.add_row().cells
        for idx, text in enumerate(row_data):
            cell = row_cells[idx]
            set_cell_margins(cell, top=80, bottom=80, left=100, right=100)
            set_cell_border(cell, bottom=dict(color="E4E4E7", sz="4"))
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            run = p.add_run(text)
            run.font.size = Pt(8.5)
            if idx == 0:
                run.font.bold = True
                run.font.color.rgb = COLOR_BLACK
            elif idx == 1:
                run.font.name = "Courier New"
                run.font.color.rgb = COLOR_BLACK
            else:
                run.font.color.rgb = COLOR_BODY

    p_warn = doc.add_paragraph()
    p_warn.paragraph_format.space_before = Pt(14)
    r_w = p_warn.add_run("Règle d'or chromatique : ")
    r_w.font.bold = True
    r_w.font.color.rgb = COLOR_BLACK
    r_w2 = p_warn.add_run("Aucune couleur d'accent (bleu, vert, violet) n'est autorisée sur les pages institutionnelles ou de conversion.")
    r_w2.font.color.rgb = COLOR_BODY

    doc.add_page_break()

    # ──────────────────────────────────────────────────────────────────────────
    # SECTION 3 : SYSTÈME TYPOGRAPHIQUE TRIDIMENSIONNEL
    # ──────────────────────────────────────────────────────────────────────────
    h3 = doc.add_heading(level=1)
    run_h3 = h3.add_run("III. SYSTÈME TYPOGRAPHIQUE TRIDIMENSIONNEL")
    run_h3.font.name = "Arial"
    run_h3.font.size = Pt(16)
    run_h3.font.bold = True
    run_h3.font.color.rgb = COLOR_BLACK

    p_typo_intro = doc.add_paragraph()
    p_typo_intro.paragraph_format.space_after = Pt(12)
    p_typo_intro.add_run(
        "L'identité Lonside repose sur un dialogue typographique rigoureusement structuré en trois voix complémentaires :"
    ).font.color.rgb = COLOR_BODY

    typo_voices = [
        ("1. La Voix Architecturale (Geist Sans / Helvetica)", "Polices sans-serif géométriques épurées. Réservée aux titres imposants, navigation, structure et lisibilité maximale. Présence affirmée mais discrète."),
        ("2. La Voix Ingénierie (JetBrains Mono / Courier)", "Police à chasse fixe (monospace). Réservée aux métadonnées techniques, délais (ex. 14 JOURS), badges de statut, code source, indicateurs et pagination."),
        ("3. La Voix Éditoriale & Humaine (Serif Italique)", "Empattements classiques en italique subtil. Réservée aux citations clés (« vous ne reviendrez jamais en arrière »), témoignages de fondateurs et manifestes d'atelier.")
    ]
    for v_title, v_desc in typo_voices:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(4)
        r = p.add_run(f"{v_title}\n")
        r.font.bold = True
        r.font.size = Pt(10)
        r.font.color.rgb = COLOR_BLACK
        rd = p.add_run(v_desc)
        rd.font.size = Pt(9.5)
        rd.font.color.rgb = COLOR_BODY

    # Règle de casse naturelle
    p_case_box = doc.add_paragraph()
    p_case_box.paragraph_format.space_before = Pt(12)
    p_case_box.paragraph_format.space_after = Pt(6)
    rc1 = p_case_box.add_run("DIRECTIVE MAJEURE DE CASSE TYPOGRAPHIQUE (i18n & ACCESSIBILITÉ) :\n")
    rc1.font.bold = True
    rc1.font.size = Pt(10)
    rc1.font.color.rgb = COLOR_BLACK
    rc2 = p_case_box.add_run(
        "Les dictionnaires de messages JSON (fr.json / en.json) doivent impérativement être rédigés en casse naturelle (Sentence case) "
        "— première lettre majuscule, reste en minuscules. Les majuscules visuelles (badges, labels) sont appliquées exclusivement "
        "par les composants via la classe CSS 'uppercase'. Cela préserve la synthèse vocale des lecteurs d'écran et garantit la réutilisabilité."
    )
    rc2.font.size = Pt(9.5)
    rc2.font.color.rgb = COLOR_BODY

    doc.add_page_break()

    # ──────────────────────────────────────────────────────────────────────────
    # SECTION 4 : GÉOMÉTRIE, RAYONS DE COURBURE & ANATOMIE DES COMPOSANTS
    # ──────────────────────────────────────────────────────────────────────────
    h4 = doc.add_heading(level=1)
    run_h4 = h4.add_run("IV. GÉOMÉTRIE & COMPOSANTS STRUCTURAUX")
    run_h4.font.name = "Arial"
    run_h4.font.size = Pt(16)
    run_h4.font.bold = True
    run_h4.font.color.rgb = COLOR_BLACK

    p_geom = doc.add_paragraph()
    p_geom.paragraph_format.space_after = Pt(10)
    p_geom.add_run(
        "La signature visuelle Lonside se distingue par une cohérence géométrique implacable sur tous les composants interactifs :"
    ).font.color.rgb = COLOR_BODY

    geom_rules = [
        ("Rayon de courbure universel (rounded-xl / 12px)", "Toutes les cartes (projets, tarifs, phases), boutons d'action (CTA) et panneaux modulaires partagent le même rayon rounded-xl. Les cartes intérieures utilisent rounded-lg (8px)."),
        ("Bordures fines semi-transparentes (border-black/[0.08])", "Aucun trait noir épais ou opaque. Les séparations sont aériennes et douces, laissant respirer les blocs d'information."),
        ("Micro-ombres imperceptibles (shadow-xs / shadow-2xs)", "Les boutons et badges flottants intègrent une ombre ultra-fine simulant un léger décollement sans effet de matière exagéré."),
        ("Tiroir de détails de projet (DossierDrawer)", "Arête droite nette (rounded-none sur le bord d'ancrage), en-tête à deux niveaux sans aucun texte tronqué, badge de durée non rogné et accessibilité clavier (Esc, inert)."),
        ("Badges tarifaires découpés", "Le badge 'RECOMMANDÉ' est positionné en absolute avec un z-index suffisant et un conteneur aéré évitant toute troncature par un overflow:hidden malencontreux.")
    ]

    for g_title, g_desc in geom_rules:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(4)
        r = p.add_run(f"• {g_title} : ")
        r.font.bold = True
        r.font.size = Pt(10)
        r.font.color.rgb = COLOR_BLACK
        rd = p.add_run(g_desc)
        rd.font.size = Pt(9.5)
        rd.font.color.rgb = COLOR_BODY

    doc.add_page_break()

    # ──────────────────────────────────────────────────────────────────────────
    # SECTION 5 : MOTION DESIGN, INTERACTIONS & RÈGLES D'OR
    # ──────────────────────────────────────────────────────────────────────────
    h5 = doc.add_heading(level=1)
    run_h5 = h5.add_run("V. MOTION DESIGN & RÈGLES D'OR DU STUDIO")
    run_h5.font.name = "Arial"
    run_h5.font.size = Pt(16)
    run_h5.font.bold = True
    run_h5.font.color.rgb = COLOR_BLACK

    p_motion = doc.add_paragraph()
    p_motion.paragraph_format.space_after = Pt(10)
    p_motion.add_run(
        "Chez Lonside, l'animation n'est jamais un spectacle : elle sert uniquement à orienter le regard et fluidifier la transition d'état."
    ).font.color.rgb = COLOR_BODY

    motion_rules = [
        ("Courbe de Bézier Signature (cubic-bezier(0.16, 1, 0.3, 1))", "Une décélération naturelle inspirée de la physique réelle. Début dynamique, atterrissage soyeux et progressif."),
        ("Durées Maîtrisées (200ms à 350ms)", "Hover d'éléments : 150-200ms. Déploiement de panneaux et rideau mobile : 300ms. Tiroir contextuel : 350ms."),
        ("Zéro Animation Rebondissante ('Bouncy')", "Les rebonds élastiques et effets cartoon sont strictement interdits. Le mouvement reste feutré, précis et stable."),
        ("Feedback Haptique & États Clavier", "Chaque bouton propose un état :focus-visible visible et net. Verrouillage du scroll à l'ouverture de modales et restauration instantanée à la fermeture.")
    ]

    for m_title, m_desc in motion_rules:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(4)
        r = p.add_run(f"• {m_title} : ")
        r.font.bold = True
        r.font.size = Pt(10)
        r.font.color.rgb = COLOR_BLACK
        rd = p.add_run(m_desc)
        rd.font.size = Pt(9.5)
        rd.font.color.rgb = COLOR_BODY

    # Conclusion & Signature
    p_fin = doc.add_paragraph()
    p_fin.paragraph_format.space_before = Pt(30)
    rf1 = p_fin.add_run("LONSIDE STUDIO  //  DIRECTION ARTISTIQUE OFFICIELLE\n")
    rf1.font.bold = True
    rf1.font.size = Pt(10)
    rf1.font.color.rgb = COLOR_BLACK
    rf2 = p_fin.add_run("Validé pour diffusion et gouvernance — Avril 2026")
    rf2.font.size = Pt(9)
    rf2.font.color.rgb = COLOR_MUTED

    doc.save(output_path)
    print(f"Document Word / Google Docs généré avec succès : {output_path}")

if __name__ == "__main__":
    out_docs = os.path.join(os.path.dirname(__file__), "LONSIDE_DIRECTION_ARTISTIQUE_OFFICIELLE.docx")
    out_public = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "LONSIDE_DIRECTION_ARTISTIQUE_OFFICIELLE.docx")
    build_lonside_da_docx(out_docs)
    build_lonside_da_docx(out_public)

