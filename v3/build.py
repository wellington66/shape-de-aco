"""Gera /v3/: o funil validado (BetterMe/Treino de Aço) com menos telas e copy mais afiada.
Parte sempre das páginas da raiz, que ficam intactas. Rodar de dentro da pasta v3: python build.py
"""
import os, re, shutil

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(AQUI)

# telas que saem do caminho (36 já era pulada)
CORTAR = [6, 13, 14, 15, 21, 23, 24, 25, 27, 28, 29, 30, 31, 33, 34, 35, 40, 42, 43]
SKIP = [36] + CORTAR

# copy: (arquivo, texto antigo, texto novo). Texto simples, a menos que comece com 'RE:'.
COPY = {
    # ---- INÍCIO (vazamento): casa com o anúncio que vende (academia/esteira não tirou a barriga, 15 min, em casa) ----
    'index.html': [
        ('Monte seu plano de calistenia militar de 28 dias', 'A academia não tirou a sua barriga. 15 minutos por dia, em casa, podem.'),
        ('PARA HOMENS · EM CASA · SEM ACADEMIA', 'TESTE GRÁTIS · PLANO DE 28 DIAS · PARA HOMENS'),
        ('Responda em 1 minuto. Primeiro, qual é a sua faixa de idade?',
         'Responda o teste rápido e receba um plano de calistenia militar montado para o seu corpo. Para começar: qual é a sua idade?'),
    ],
    'p01.html': [
        ('Ganhe força e músculos treinando em casa', 'Seu corpo mudou. O treino precisa mudar junto.'),
        ('homens adultos</b>, sem academia.', 'homens adultos</b>, com treinos de 15 minutos, em casa e sem academia.'),
        ('Vamos conhecer seu objetivo e sua rotina para ajudar você a começar.', 'Mais algumas perguntas rápidas e o seu plano começa a ser montado.'),
    ],
    'p02.html': [('Você já tentou treinos de calistenia antes?', 'Você já tentou perder a barriga na academia ou na esteira?')],
    'p04.html': [('<span class="list-option_title__tMXmQ">Perder peso</span>', '<span class="list-option_title__tMXmQ">Secar a barriga e perder peso</span>')],
    'p05.html': [('A calistenia ajudará você a desenvolver força e músculos sem passar horas na academia.',
                  'Treinos de 15 minutos, em casa e sem equipamento: o corpo inteiro trabalha de uma vez.')],
    # ---- meio do funil ----
    'p09.html': [('Há quanto tempo você esteve na melhor forma da sua vida?', 'Há quanto tempo você não sente orgulho do seu corpo?')],
    'p16.html': [('Sem tempo? Então é para você', 'Sem tempo? Treine 15 minutos e economize mais de 15 horas por mês'),
                 ('Os treinos duram de 10 a 25 minutos e cabem antes do trabalho, no almoço ou antes de dormir.',
                  'Academia come mais de 1h30 por dia entre ir, treinar e voltar. Aqui os treinos duram de 10 a 25 minutos e cabem antes do trabalho ou no almoço, em casa.')],
    'p26.html': [('Chega de chegar em casa sem energia', 'Chega de chegar em casa sem energia e sem vontade de nada')],
    'p44.html': [('Seu plano mostra onde você pode chegar', 'Veja onde você pode estar em 28 dias'),
                 ('RE:<b>F.rias</b>', '<b>seu novo corpo</b>'), ('RE:F.rias . 1 de mar.o', 'Seu objetivo')],
    'p45.html': [('O que impediu você de entrar em forma antes?', 'O que fez você desistir das outras vezes?')],
    'p46.html': [('Quem tem um plano não depende de motivação', 'Chega de começar na segunda e desistir na quarta')],
}

# scripts que trocam o título conforme a resposta anterior
JS_COPY = {
    'etapa-04.js': [
        ("experienced ? 'Mais força e definição, sem academia.' : 'Comece do zero. Construa um corpo mais forte.'",
         "experienced ? 'Não foi falta de esforço. Foi o método.' : 'Você começa do jeito certo.'"),
        ("? 'O Desafio Treino de Aço funciona para todos os níveis. A partir daqui, vamos conhecer seu nível atual e o que você quer conquistar com os treinos.'",
         "? 'Horas em um aparelho de cada vez cansam o corpo e pouco mudam a barriga. A calistenia militar usa o corpo inteiro de uma vez: 15 minutos por dia, em casa.'"),
        (": 'O Desafio Treino de Aço funciona para todos os níveis. Conheça seu ponto de partida e avance no seu ritmo.'",
         ": 'Você não precisa de academia nem de esteira. Com calistenia militar o corpo inteiro treina em 15 minutos por dia, em casa e no seu ritmo.'"),
        ("title.textContent = 'Você vai arrasar!';", "title.textContent = 'Você começa do jeito certo.';"),
    ],
    'etapa-06.js': [
        ("'Ganhar massa muscular rapidamente!'", "'Ganhar músculo sem passar horas na academia'"),
        ("'Perder peso rapidamente!'", "'Secar a barriga com 15 minutos por dia'"),
        ("'Perder gordura e ganhar músculos rapidamente!'", "'Perder gordura e ganhar músculo ao mesmo tempo'"),
        ("'Ter mais força e condicionamento físico rapidamente!'", "'Ganhar força e energia para o dia a dia'"),
        ("'Avance em direção ao seu objetivo!'", "'Seu plano de 28 dias está sendo montado'"),
    ],
}


def troca(s, a, b, onde):
    if a.startswith('RE:'):
        novo = re.sub(a[3:], lambda m: b, s)
    else:
        novo = s.replace(a, b)
    if novo == s:
        print('AVISO: não achei em', onde, ':', a[:60])
    return novo


def reescreve(s):
    s = re.sub(r'(src|href)="(assets|css|marca|legal)/', r'\1="../\2/', s)
    s = re.sub(r'srcset="([^"]*)"', lambda m: 'srcset="' + re.sub(r'(^|,\s*)assets/', lambda q: q.group(1) + '../assets/', m.group(1)) + '"', s)
    s = re.sub(r'src="(personal|carrossel)\.js"', lambda m: 'src="../%s.js"' % m.group(1), s)
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
            s = troca(s, a, b, nome)
        open(os.path.join(AQUI, nome), 'w', encoding='utf-8', newline='').write(reescreve(s))
    r = open(os.path.join(RAIZ, 'replica.js'), encoding='utf-8').read()
    r = re.sub(r'^window\.REPLICA_TOTAL=\d+; window\.REPLICA_SKIP=\[[^\]]*\];', lambda m: 'window.REPLICA_TOTAL=55; window.REPLICA_SKIP=%s;' % SKIP, r)
    open(os.path.join(AQUI, 'replica.js'), 'w', encoding='utf-8', newline='').write(r)
    for e in ('etapa-01.js', 'etapa-02.js', 'etapa-04.js', 'etapa-06.js'):
        s = open(os.path.join(RAIZ, e), encoding='utf-8').read()
        for a, b in JS_COPY.get(e, []):
            s = troca(s, a, b, e)
        open(os.path.join(AQUI, e), 'w', encoding='utf-8', newline='').write(s)
    print('v3 pronto:', len(nomes), 'páginas | puladas:', SKIP)


main()
