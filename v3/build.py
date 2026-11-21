"""Gera /v3/: o funil validado (BetterMe/Treino de Aço) com menos telas e copy mais afiada.
Parte sempre das páginas da raiz, que ficam intactas. Rodar de dentro da pasta v3: python build.py
"""
import os, re, shutil

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(AQUI)

# telas que saem do caminho (36 já era pulada). Ficam 35 telas + raspadinha e vendas já contadas.
CORTAR = [6, 13, 14, 15, 21, 23, 24, 25, 27, 28, 29, 30, 31, 33, 34, 35, 40, 42, 43]
SKIP = [36] + CORTAR

# copy: (arquivo, regex ou texto, novo texto). Aplica em todas as ocorrências.
COPY = {
    'p09.html': [('Há quanto tempo você esteve na melhor forma da sua vida?', 'Há quanto tempo você não sente orgulho do seu corpo?')],
    'p16.html': [('Sem tempo? Então é para você', 'Sem tempo? Treine 15 minutos e economize mais de 15 horas por mês'),
                 ('Os treinos duram de 10 a 25 minutos e cabem antes do trabalho, no almoço ou antes de dormir.',
                  'Academia come mais de 1h30 por dia entre ir, treinar e voltar. Aqui os treinos duram de 10 a 25 minutos e cabem antes do trabalho ou no almoço, em casa.')],
    'p26.html': [('Chega de chegar em casa sem energia', 'Chega de chegar em casa sem energia e sem vontade de nada')],
    'p44.html': [('Seu plano mostra onde você pode chegar', 'Veja onde você pode estar em 28 dias'),
                 (r'<b>F.rias</b>', '<b>seu novo corpo</b>'), (r'F.rias . 1 de mar.o', 'Seu objetivo')],
    'p45.html': [('O que impediu você de entrar em forma antes?', 'O que fez você desistir das outras vezes?')],
    'p46.html': [('Quem tem um plano não depende de motivação', 'Chega de começar na segunda e desistir na quarta')],
}


def reescreve(s, n):
    s = re.sub(r'(src|href)="(assets|css|marca|legal)/', r'\1="../\2/', s)
    s = re.sub(r'srcset="([^"]*)"', lambda m: 'srcset="' + re.sub(r'(^|,\s*)assets/', lambda q: q.group(1) + '../assets/', m.group(1)) + '"', s)
    s = re.sub(r'src="(personal|carrossel)\.js"', r'src="../\1.js"', s)
    s = re.sub(r'al-passo" content="(\d+)\|', lambda m: 'al-passo" content="%d|v3 ' % (200 + int(m.group(1))), s, count=1)
    return s


def main():
    nomes = ['index.html'] + ['p%02d.html' % i for i in range(1, 55) if i not in SKIP]
    for f in os.listdir(AQUI):
        if f.endswith('.html') or f in ('replica.js', 'etapa-01.js', 'etapa-02.js', 'etapa-04.js', 'etapa-06.js'):
            os.remove(os.path.join(AQUI, f))
    for nome in nomes:
        p = os.path.join(RAIZ, nome)
        if not os.path.exists(p):
            continue
        s = open(p, encoding='utf-8').read()
        for a, b in COPY.get(nome, []):
            novo = re.sub(a, b, s) if a.startswith('<b>') or a.startswith('F.rias') else s.replace(a, b)
            if novo == s:
                print('AVISO: não achei em', nome, ':', a[:50])
            s = novo
        open(os.path.join(AQUI, nome), 'w', encoding='utf-8', newline='').write(reescreve(s, nome))
    # JS de navegação local (a lista de telas puladas é diferente)
    r = open(os.path.join(RAIZ, 'replica.js'), encoding='utf-8').read()
    r = re.sub(r'^window\.REPLICA_TOTAL=\d+; window\.REPLICA_SKIP=\[[^\]]*\];', 'window.REPLICA_TOTAL=55; window.REPLICA_SKIP=%s;' % SKIP, r)
    open(os.path.join(AQUI, 'replica.js'), 'w', encoding='utf-8', newline='').write(r)
    for e in ('etapa-01.js', 'etapa-02.js', 'etapa-04.js', 'etapa-06.js'):
        shutil.copy(os.path.join(RAIZ, e), os.path.join(AQUI, e))
    print('v3 pronto:', len(nomes), 'páginas | puladas:', SKIP)


main()
