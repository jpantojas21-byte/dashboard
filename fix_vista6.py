import re

with open('dashboard/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find start of Vista 6 section
marker = '                <!-- VISTA 6: DOCUMENTO DE ENTREGA (Solo Descarga) -->'
idx = content.find(marker)

# Find the footer comment that comes AFTER the main/div closing
rest_marker = '        <!-- FOOTER -->'
rest_idx = content.find(rest_marker)

before = content[:idx]
after = content[rest_idx:]

new_vista6 = (
    '                <!-- VISTA 6: DOCUMENTO DE ENTREGA (Solo Descarga) -->\n'
    '                <section id="view-document" class="tab-pane">\n'
    '                    <div class="doc-download-panel">\n'
    '                        <div class="doc-download-header">\n'
    '                            <span class="doc-badge">Documento Oficial de Evaluaci\u00f3n</span>\n'
    '                            <h3>Informe T\u00e9cnico de Anal\u00edtica \u2013 Aeron\u00e1utica Civil de Colombia</h3>\n'
    '                            <p class="doc-download-meta">\n'
    '                                <strong>Estudiante:</strong> Jorge Armando Pantoja Salguedo &nbsp;|&nbsp;\n'
    '                                <strong>Docente:</strong> Mg. Andrew Arnedo Pertuz &nbsp;|&nbsp;\n'
    '                                Cartagena de Indias, 2026\n'
    '                            </p>\n'
    '                        </div>\n'
    '                        <div class="doc-download-cards">\n'
    '                            <a href="docs/Informe_Tecnico_Aeronautica_Civil.docx" download class="doc-download-card word">\n'
    '                                <span class="doc-dl-icon">\U0001f4c4</span>\n'
    '                                <div class="doc-dl-info">\n'
    '                                    <strong>Descargar en Word</strong>\n'
    '                                    <span>Informe_Tecnico_Aeronautica_Civil.docx</span>\n'
    '                                </div>\n'
    '                                <span class="doc-dl-arrow">&#8595;</span>\n'
    '                            </a>\n'
    '                            <a href="docs/Informe_Tecnico_Aeronautica_Civil.pdf" download class="doc-download-card pdf">\n'
    '                                <span class="doc-dl-icon">\U0001f4d5</span>\n'
    '                                <span class="doc-dl-arrow">&#8595;</span>\n'
    '                            </a>\n'
    '                        </div>\n'
    '                    </div>\n'
    '                </section>\n'
    '            </main>\n'
    '        </div>\n\n'
)

new_content = before + new_vista6 + after

with open('dashboard/index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Done. Lines:', new_content.count('\n'))
print('Student name present:', 'Jorge Armando Pantoja Salguedo' in new_content)
print('Old TOC removed:', 'TABLA DE CONTENIDO' not in new_content)
