export const MODAL_PROPS = {
    modal: true,
    maximizable: true,
    style: {
        width: '65vw',
        height: '65vw',
    },
    breakpoints: {
        '960px': '85vw',
        '640px': '90vw'
    }
};

export function resolveType(type) {
    let r = type;
    if (type == "rules" || type == "rule") r = "Regel"
    else if (type == "measures" || type == "measure") r = "Div. Maßnahme"
    else if (type == "kpis" || type == "kpi") r = "KPI"
    else if (type == "testcases" || type == "testcase") r = "Testcase"
    return r;
}

export const MODULE_LOGICTYPE = [
    {
        value: 0,
        label: "unbekannt",
    },
    {
        value: 1,
        label: "klassisch regelbasiert (eigener Code)",
    },
    {
        value: 2,
        label: "klassisch regelbasiert (fremder einsehbarer Code)",
    },
    {
        value: 3,
        label: "klassisch regelbasiert (fremder nicht einsehbarer Code)",
    },
    {
        value: 4,
        label: "datengetrieben (selbst trainiert, bekannte Daten)",
    },
    {
        value: 5,
        label: "datengetrieben (fremd trainiert, bekannte Daten)",
    },
    {
        value: 6,
        label: "datengetrieben (fremd trainiert, unbekannte Daten)",
    },
    {
        value: 7,
        label: "gemischt (regel- und datengetrieben)",
    },
]

export const KPI_CHARTDISPLAYMODE_OPTIONS = [
    {
        label: "kein UI",
        value: 1
    },
    {
        label: "Simple Table-View",
        value: 2
    },
    {
        label: "Chart: URL-Data & chartjs-Config",
        value: 3
    },
    {
        label: "Chart: URL-Data & plotly-Config",
        value: 4
    },
    {
        label: "Chart: free chart per JavaScript",
        value: 5
    },
];

export const KPI_CHARTTYPE_OPTIONS = [
    {
        label: "Pie",
        value: "pie"
    },
    {
        label: "Doughtnut",
        value: "doughtnut"
    },
    {
        label: "Line",
        value: "line"
    },
    {
        label: "Bar",
        value: "bar"
    },
    {
        label: "Radar",
        value: "radar"
    },
    {
        label: "PolarArea",
        value: "polarArea"
    },
];

export const RULE_REPEATING_OPTIONS = [
    {
        label: "keine Fehlertoleranz",
        value: 1
    },
    {
        label: "2 Fehler in Reihe nötig",
        value: 2
    },
    {
        label: "3 Fehler in Reihe nötig",
        value: 3
    },
]

export const RULE_CHECKFREQ_OPTIONS = [
    {
        label: "bei jedem Matching",
        value: 1
    },
    {
        label: "stündlich",
        value: 2
    },
    {
        label: "täglich",
        value: 3
    },
    {
        label: "wöchentlich",
        value: 4
    },
    {
        label: "monatlich",
        value: 5
    },
    {
        label: "pro Quartal",
        value: 6
    },
];

export const RISK_PROBABILITY_OPTIONS = [
    {
        label: "fast sicher",
        value: 6
    },
    {
        label: "sehr wahrscheinlich",
        value: 5
    },
    {
        label: "wahrscheinlich",
        value: 4
    },
    {
        label: "unwahrscheinlich",
        value: 3
    },
    {
        label: "sehr unwahrscheinlich",
        value: 2
    },
    {
        label: "unmöglich",
        value: 1
    }

];

export function resolveRiskProbability(i) {
    return "hoch" + i;
}

export const RISK_IMPACT_OPTIONS = [
    {
        label: "katastrophal",
        value: 6
    },
    {
        label: "groß",
        value: 5
    },
    {
        label: "durchschnittlich",
        value: 4
    },
    {
        label: "klein",
        value: 3
    },
    {
        label: "sehr klein",
        value: 2
    },
    {
        label: "unmöglich",
        value: 1
    }
];

export function getTestcaseTectypeLabel(i) {
    if (i == null) return "";
    return TESTCASE_TECTYPE_OPTIONS.find(x => x.value === i).label;
}


export function getTestcaseTectypeDesc(i) {
    if (i == null) return "";
    return TESTCASE_TECTYPE_OPTIONS.find(x => x.value === i).desc;
}

export const TESTCASE_TECTYPE_OPTIONS = [
    {
        value: 1,
        label: "Vergleichendes Testen",
        desc: "Zwei gleichwertige Systeme werden im Vergleich getestet. Eines kann ein unabhängig entwickeltes System oder eine frühere Variante des aktuellen Systems sein. Es können bereits vorhandene Testfälle genutzt werden, wie z.B. Regressionstestfälle.",
    },
    {
        value: 2,
        label: "A/B-Testen",
        desc: "Das A/B-Testen ist ein statistisches Verfahren, bei dem man die Varianten desselben Systems vergleicht. Die Eingaben für die beiden Varianten können sich unterscheiden. Man musst nicht zwingend genau die gleichen Eingabedaten verwenden, wie es beim vergleichenden Testen der Fall ist. Beim A/B-Test lässt sich prüfen, ob die neue Variante eines ML-Modells datenverunreinigt ist oder einen Bias enthält.",
    },
    {
        value: 3,
        label: "Metamorphes Testen",
        desc: "Testfälle, die das gleiche erwartete Ergebnis überprüfen, jedoch unter unterschiedlichen Bedingungen oder mit leicht veränderten Eingaben.",
    },
    {
        value: 4,
        label: "Gegnerisches Testen",
        desc: "Man testet mit gegnerischen Beispielen, um Schwachstellen zu finden und das System dadurch robuster zu gestalten. Insbesondere bei einer Fehlklassifikation mit großen Auswirkungen für die Nutzerinnen und Nutzer oder für die Umgebung des KI-basierten Systems ist es sinnvoll, gegnerisches Testen einzusetzen.",
    },
    {
        value: 5,
        label: "Paarweises Testen",
        desc: "Wenn man mit vielen Parametern umgehen muss und eine Testfallexplosion vermeiden will, dann eignet sich paarweises Testen. Man testet immer bestimmmte Variantenpaare und muss nicht alle möglichen Komibationen testen. Es ist wissenschaftlich belegt, dass der Mehrwert einer vollständigen Testfallabdeckung minimal ist und die meisten Fehler bereits mit dem paarweisen Testen gefunden werden können, und das in viel kürzerer Zeit.",
    },
    {
        value: 6,
        label: "Erfahrungsbasiertes Testen",
        desc: "Durch den Einsatz von Vorwissen und Erfahrung kann man KI-basierte Syteme explorativ testen, um z.B. Trainingsdaten zu überprüfen oder den ML-Algorithmus zu validieren. Fehlt die eigene Erfahrung, dann können Test-Checklisten für ML-Systeme helfen (wie z.B. die von Google).",
    },
    {
        value: 7,
        label: "Überdeckungsmaße für neuronale Systeme",
        desc: "Ein neuronales Überdeckungsmaß ist eine Metrik oder eine Messgröße, die verwendet wird, um die Effektivität der Testabdeckung bei der Prüfung von neuronalen Netzwerken zu bewerten. Die Eingabeüberdeckung, testet wie viele unterschiedliche Eingaben getestet wurden. Neuronenüberdeckung, besagt wieviele Neuronen im Netzwerk aktiviert oder überdeckt wurden. Die Pfadüberdeckung sagt, wie viele verschiedene Pfade durch das Netzwerk getestet wurden. Die Fehlerüberdeckung sagt aus, wie gut Fehler im Netzwerk erkannt und behandelt wurden.",
    },
];

export function getTestcasePytypeLabel(i) {
    if (i == null) return "";
    return TESTCASE_PYTYPE_OPTIONS.find(x => x.value === i).label;
}

export function getTestcasePytypeDesc(i) {
    if (i == null) return "";
    return TESTCASE_PYTYPE_OPTIONS.find(x => x.value === i).desc;
}

export const TESTCASE_PYTYPE_OPTIONS = [
    {
        value: 5,
        label: "Systemtest",
        desc: "Nicht nur die Verifizierung der Akzeptanzkriterien, sondern Validierung ob das System aus Sicht des Menschen für den angedachten Einsatz geeignet ist.",

    },
    {
        value: 4,
        label: "Integrationstest",
        desc: "Der Komponentenintegrationstest ist eine konventionelle Teststufe, welche die Schnittstellen zwischen den integrierten Komponenten darauf, dass diese wie erwartet zusammenwirken. So werden in der Regel mehrere Module zusammen getestet, die sowohl KI als auch Nicht-KI sein können.",

    },
    {
        value: 3,
        label: "ML-Modelltest",
        desc: "Ziel dieser Teststufe ist der Test des Modells, sowie die Absicherung der Aktivitäten, die das Training vorbereiten: Auswahl des ML-Frameworks und Auswahl/Umsetzung des Algorithmus. Häufig geschieht das auch mithilfe von Reviews um sicherzustellen, dass die zu Beginn des ML-Workflows festgelegten Ziele, Prioritäten und Akzeptanzkriterien bei den getroffenen Framework-, Design- und Implementierungsentscheidungen berücksichtig wurden.",

    },
    {
        value: 2,
        label: "Eingabedatentest",
        desc: "Ziel des Eingabedatentests ist es sicherzustellen, dass die Datensätze für das Training, die Evaluierung, den Test und den Betrieb des Systems eine möglichst hohe Qualität haben. Da die Datenvorbereitung meist (teil-)automatisiert ist, führt man beim Eingabetest im klassischen Sinne Komponenten- und Integrationstests der Datenpipeline durch. Im Betrieb sind evtl. weitere Testarten sind: Reviews, statistische Techiken, EDA, statische und dynamische Test der Betriebsdatenpipline, aber auch der Datenvorbereitung, um deren Eignung und Gleichwertigkeit sicherzustellen.",
    },
    {
        value: 1,
        label: "Komponententest",
        desc: "Der Komponenentest konzentriert sich auf alle konventionellen Softwarekomponenten, also diejenigen ohne KI. Diese Komponenten zeichnet aus, dass sie für sich allein testbar sind – ggf. in einer für sie zugeschnittenen Testumgebung. Für KI-Komponenten (das ML-Modell) ist der ML-Modelltest anzuwenden.",
    },
];

export function getBiasTypeLabel(i) {
    if (i == null) return "";
    return TESTCASE_BIASTYPE_OPTIONS.find(x => x.value === i).label;
}

export function getBiasTypeDesc(i) {
    //console.log("get: " + i);
    if (i == null) return "";
    else return TESTCASE_BIASTYPE_OPTIONS.find(x => x.value === i).desc;
}

export const TESTCASE_BIASTYPE_OPTIONS = [
    {
        value: 11,
        label: "Historical Bias",
        desc: "Historische Verzerrungen sind die bereits bestehenden Vorurteile und soziotechnischen Probleme in der Welt und können selbst bei perfekter Stichprobenziehung und Merkmalsauswahl in den Datenerstellungsprozess eindringen. <br>Ein Beispiel für diese Art von Bias zeigt sich in einem Ergebnis der Google-Bildersuche aus dem Jahr 2018: Die Suchanfrage 'Frauen als CEOs' zeigte als Ergebnis mehr Bilder von männliche CEOs statt der gewünschten Bilder von weiblichen CEOs, da zu dieser Zeit nur knapp  5 % der CEOs der Fortune 500-Unternehmen Frauen waren.",
        src: "https://bias-and-fairness-in-ai-systems.de/grundlagen/",
    },
    {
        value: 12,
        label: "Representation Bias",
        desc: "Repräsentationsverzerrungen ergeben sich aus der Art und Weise, wie wir beim Datenerhebungsprozesses vorgehen. Nicht repräsentativen Stichproben fehlt es an der Vielfalt der Grundgesamtheit (bspw. fehlende Untergruppen).<br>Beispiel: Mangelnde geografische Vielfalt in Datensätzen wie beispielsweise ImageNet (https://www.image-net.org/) führt zu einer nachweisbaren Voreingenommenheit gegenüber westlichen Kulturen.",
        src: "https://bias-and-fairness-in-ai-systems.de/grundlagen/",
    },
    {
        value: 13,
        label: "Measurement Bias",
        desc: "Messfehler treten bei der Auswahl, Erfassung oder Berechnung von Merkmalen und Bezeichnungen auf, die in einem Vorhersageproblem verwendet werden sollen. In der Regel ist ein Merkmal oder eine Kennzeichnung ein Proxy (ein konkretes Maß), das zur Annäherung an ein Konstrukt gewählt wird, das nicht direkt kodiert oder beobachtbar ist.<br>Ein Beispiel für diese Art von Verzerrung wurde beim Rückfallrisikoprognosetool von COMPAS beobachtet, bei dem frühere Verhaftungen und Verhaftungen im Freundes-/Familienkreis als Ersatzvariablen zur Messung des 'Risikoniveaus' oder der 'Kriminalität' verwendet wurden – was als falsch gemessene Proxies betrachtet werden kann.",
        src: "https://bias-and-fairness-in-ai-systems.de/grundlagen/",
    },
    {
        value: 14,
        label: "Omitted Variable Bias",
        desc: "Omitted Variable Bias tritt auf, wenn eine oder mehrere wichtige Variablen aus dem Modell ausgelassen werden.<br>Beispielsweise leiden viele Regressionen, bei denen der Lohn oder das Einkommen die abhängige Variable ist, unter der Verzerrung durch weggelassene Variablen. Oft gibt es hier keine praktische Möglichkeit, die angeborenen Fähigkeiten oder die Motivation eines Arbeitnehmenden als erklärende Variablen hinzuzufügen.",
        src: "https://bias-and-fairness-in-ai-systems.de/grundlagen/",
    },
    {
        value: 21,
        label: "Evaluation Bias",
        desc: "Der Bias tritt auf, wenn die für eine bestimmte Aufgabe verwendeten Trainingsdaten nicht die Nutzungspopulation repräsentieren. Der Bias kann auch durch die Wahl der Performance-Metriken verstärkt werden.<br>Dazu gehört beispielsweise die Verwendung unangemessener und unverhältnismäßiger Vergleichsdaten für die Bewertung von Anwendungen wie beispielsweise der Adience-Datensatz, welcher sich zu 79,6 % aus hellhäutigen Gesichtern zusammensetzt. Dieser Datensatz wird bei der Bewertung von Gesichtserkennungssystemen herangezogen, bei denen Hautfarbe und Geschlecht eine Rolle spielen.",
        src: "https://bias-and-fairness-in-ai-systems.de/grundlagen/",
    },
    {
        value: 22,
        label: "Algorithmic Bias",
        desc: "Hierunter versteht man Verzerrungen, die nicht in den Daten enthalten sind, sondern lediglich durch den Algorithmus hinzugefügt werden.<br>Beispiel: Die Verwendung bestimmter Optimierungsfunktionen, Regularisierungen, die Anwendung von Regressionsmodellen auf die Daten als Ganzes oder auf Untergruppen sowie die allgemeine Verwendung von statistisch verzerrten Schätzern sind Beispiele für diese Art von Bias.",
        src: "https://bias-and-fairness-in-ai-systems.de/grundlagen/",
    },
    {
        value: 23,
        label: "Aggregation Bias",
        desc: "Aggregationsverzerrungen treten auf, wenn ein Einheitsmodell für Daten verwendet wird, denen Gruppen oder Typen von Beispielen zugrunde liegen, die unterschiedlich betrachtet werden sollten.<br>Ein Beispiel wären Daten, die zeigen, dass Schüler*innen in den Großstädten dazu neigen, bei standardisierten Tests schlecht abzuschneiden. Das heißt aber nicht, dass jeder Einzelne schlecht abschneidet.",
        src: "https://bias-and-fairness-in-ai-systems.de/grundlagen/",
    },
    {
        value: 24,
        label: "User Interaction Bias",
        desc: "Damit ist ein Bias durch die Benutzeroberfläche und durch den Nutzenden selbst gemeint, indem das System sein selbstgewähltes einseitiges Verhalten und seine Interaktion aufzwingt.<br>Beispielsweise können Nutzer*innen im Internet nur auf Inhalte klicken, die ihnen angezeigt werden, d. h., die gesehenen Inhalte werden angeklickt, während alles andere dementsprechend nicht geklickt wird.",
        src: "https://bias-and-fairness-in-ai-systems.de/grundlagen/",
    },
    {
        value: 25,
        label: "Population Bias",
        desc: "Eine Verzerrung der Population entsteht, wenn Statistiken, demografische Daten, Repräsentant*innen und Nutzereigenschaften in der Nutzerpopulation der Plattform anders sind als in der ursprünglichen Zielgruppe.<br>Beispiel: Verzerrungen in der Bevölkerung führen zu nicht repräsentativen Daten. So sind beispielsweise mehr männliche Zuschauer im Fußballstadion anzutreffen als weibliche Zuschauerinnen.",
        src: "https://bias-and-fairness-in-ai-systems.de/grundlagen/",
    },
    {
        value: 26,
        label: "Deployment Bias",
        desc: "Die Verzerrung beim Einsatz des Systems bezieht sich im Allgemeinen auf jede Verzerrung, die während des Einsatzes auftritt, wenn ein System auf unangemessene Weise verwendet oder interpretiert wird, was so nicht von den Designer*innen oder Entwickler*innen beabsichtigt war.<br>Beispiel: Algorithmische Risikobewertungstools wie COMPAS sind Modelle, die die Wahrscheinlichkeit einer Person, eine zukünftige Straftat zu begehen, vorhersagen sollen. In der Praxis könnten diese Instrumente jedoch auch “zweckentfremdet” eingesetzt werden, z. B. zur Bestimmung der Länge einer Strafe.",
        src: "https://bias-and-fairness-in-ai-systems.de/grundlagen/",

    },
    {
        value: 27,
        label: "Feedback Loop",
        desc: "Eine Rückkopplungsschleife zwischen Daten, Algorithmen und Nutzenden, kann die bestehenden Quellen von Verzerrungen noch verstärken.<br>Beispiel: Empfehlungsalgorithmen sind dafür bekannt, dass einige wenige beliebte Artikel häufig empfohlen werden, während die Mehrheit der anderen Artikel “ignoriert” wird. Diese Empfehlungen werden dann von den Nutzer*innen konsumiert, ihre Reaktion wird protokolliert und dem System hinzugefügt.",
        src: "https://bias-and-fairness-in-ai-systems.de/grundlagen/",
    },
    // {
    //     value: 1,
    //     label: "Algorithmischer Bias",
    //     desc: "Analyse des Modells durch Metriken während der Trainings-, Evaluierungs- und Optimierungsaktivitäten."
    // },
    // {
    //     value: 2,
    //     label: "Stichprobenbias",
    //     desc: "<ul><li>Review der Quelle der Trainingsdaten und der Datengewinnung</li><li>Review der Datenvorverarbeitung.</li></ul > "
    // },
    // {
    //     value: 3,
    //     label: "Unangemessener Bias",
    //     desc: "<ul><li>Messung, wie sich Änderungen der Systemeingaben auf die Systemausgaben über eine große Anzahl von Interaktionen auswirken</li><li>Untersuchung der Ergebnisse auf der Grundlage der Gruppen von Personen oder Objekten, für oder gegen die das System möglicherweise unangemessen verzerrt ist</li><li>Beschaffung zusätzlicher Informationen über die Attribute der Eingabedaten, die möglicherweise mit dem Bias zusammenhängen, und deren Korrelation mit den Ergebnissen.</li></ul>"
    // },
];