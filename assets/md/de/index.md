# Markdown Reader [DE]

<!-- ====================================================================== -->

## <!-- Empty H2 -->

Der Markdown Reader ist eine vielseitige Dokumentations- und Präsentations-dizmo basierend auf [Markdown ][1].
<!-- ---------------------------------------------------------------------- -->

### Einführung

Mit dem `MarkdownReader` dizmo können [Markdown][1] (MD) Inhalte angezeigt werden. Auf der linken Seite sehen Sie den Inhalt und auf der rechten das Inhaltsverzeichnis (TOC) Panel, welche an und abgeschaltet werden kann.

Diese Dokumentation selbst ist in HTML gerendert, die von einer MD Datenquelle generiert wurde, daher ist `MarkdownReader` ein selbst-dokumentierendes dizmo.

Mit Hilfe von CSS kann der in HTML gerenderte Inhalt gestaltet werden. Der `MarkdownReader` kommt mit einem kleinen Set vordefinierter Styles, die nach Bedürfnis überschrieben werden können.

Der Inhalt in MD und das Styling (CSS) des `MarkdownReader` kann durch die folgenden Methoden gespiesen werden: (a) indem URLs angegeben werden, woher das dizmo die Informationen holt oder (b) indem ein neues dizmo erstellt und in dem der `MarkdownReader` Source Code eingebettet wird mit Hilfe [GIT Submodules][2].

Die Option (a) ist zwar einfacher, aber mit (b) haben Sie mehr Möglichkeiten, Ihr eigenes auf `MarkdownReader` basierendes dizmo anzupassen. Das heisst, Sie können das dizmo mit Icons, einem eigenen Titel (für Ihr Brand) ausstatten, oder direkt *Assets* (wie zum Beispiel Konfiguration, Inhalt, Styles und Bilder) einbetten und sind so nicht vom Internet abhängig.

<!-- ---------------------------------------------------------------------- -->

### Overview

|   | Thema | Datei(en) oder Bemerkungen |
|---|---------|--------------------|
| 1 | Einstellungen | assets/settings.json |
| 2 | Markdown Inhalt | assets/md/${LANGUAGE}/index.md |
| 3 | CSS Styling | assets/css/reader.css |
| 4 | Paginierung | Weiter and Zurück Schaltflächen |
| 5 | JavaScript Hooks | assets/js/hooks.js |
| 6 | Markdown Headers | Besonderheiten mit H1 und H2 |
| 7 | TOC Panel | Leere Headers werden nicht angezeigt |
| 8 | Scrolling | Inhalt und TOC Scrollbars |
| 9 | Rückseite| URLs und integrierter CSS Editor |

---

**Einstellungen:**

Mit Hilfe der Konfigurationsdatei `assets/settings.json` kann der `MarkdownReader` angepasst werden.

**Markdown Inhalt:**

Der Inhalt wird in der MD Schreibweise verfasst: Er wird entweder durch eine absolute URL oder einen relativen Pfad zur Verfügung gestellt, der eine `${LANGUAGE}` Variable für Sprachenübersetzung haben kann.

**CSS Styling:**

Gestaltet der in HTML gerenderte MD Inhalt und wird entweder durch eine absolute URL oder einen relativen Pfad zur Verfügung gestellt.

**Paginierung:**

Der Inhalt kann mit Seiten strukturiert werden. Der `MarkdownReader` blättert durch die Seiten: Wenn Sie `#pager` HTML zuunterst einer MD Datenquelle setzen, wird der Inhalt unterhalt der Headers der Ebene *H3* geteilt und als separate Seiten dargestellt. Auch werden die Weiter and Zurück Schaltflächen angezeigt.

**Markdown Headers:**

Wenn die Paginierung angeschaltet ist, ist der Inhalt unmittelbar unterhalb H1 (oder H2) Headers statisch, d.h. er wird jeweils auf jede H2 (oder H3) Unterseite angezeigt.

**JavaScript Hooks:**

Wenn die Paginierung angeschaltet ist, können Sie JavaScript Hooks beim Umblättern aufrufen: Setzen Sie dafür das `assets/js/hooks.js` Script unterhalb von `#pager` HTML. Mit den JavaScript Hooks können Sie interaktiven Inhalt implementieren.

**TOC Panel:**

Das Inhaltsverzeichnis (TOC) Panel auf der rechten Seite kann an und abgestellt werden mit Hilfe des dizmo Menus. Diese Panel können vollständig abgeschaltet werden, indem das entsprechende Flag im `assets/settings.json` gesetzt wird.

**Scrolling:**

Die Inhalt- und Verzeichnis-Panels können scrollen. Der Scrollbar wird standardmässig für das Inhalts-Panel nicht, jedoch für das Inhaltsverzeichnis-Panel angezeigt.

**Rückseite**

Die Rückseite des `MarkdownReader` dizmos zeigt zwei Felder an, in denen die MD and CSS URLs eingegeben werden, und einen eingebetteten CSS Editor. Standardmässig kann auf die Rückseite gedreht werden, es kann aber abgeschaltet werden.

<!-- ====================================================================== -->

## <!-- Empty H2 -->

Indem Sie die Konfigurationsdatei `assets/settings.json` editieren, kann der `MarkdownReader` angepasst werden.

<!-- ---------------------------------------------------------------------- -->

### Settings.json

Diese Datei konfiguriert fast jeden Aspekt des `MarkdownReader`. Es ist in der JSON Schreibweise verfasst, und erlaubt sogar mehrzeilige Kommentare wie `/*..*/`.

Die verschiedenen Aspekte des `MarkdownReader` können hier konfiguriert werden und werden in der restlichen Dokumentation beschrieben. Zudem enthält diese Datei selbst die vorher beschriebenen Kommentare als zusätzliche Form der Dokumentation und Hilfe.

<!-- ====================================================================== -->

## <!-- Empty H2 -->

Der Inhalt wird in der MD Schreibweise verfasst: Er wird entweder durch eine absolute URL oder einem relativen Pfad zur Verfügung gestellt.

<!-- ---------------------------------------------------------------------- -->

### Markdown content

Die [Markdown][1] Datenquelle wird in der Konfigurationsdatei `settings.json` mit dem Schlüssel `urlMd` konfiguriert: Wenn Sie dessen Wert auf `assets/md/${LANGUAGE}/index.md` setzen, wird der Inhalt beim Start zum dizmo Root relativen Pfad geholt.

Falls die `${LANGUAGE}` Variable im Pfad angegeben wird, wird sie dynamisch durch eine zwei-zeichen Abkürzung der aktuellen dizmoViewer Sprache ersetzt, wie zum Beispiel *en* für Englisch.

Auch muss der Wert für `urlMd` nicht unbedingt einen (lokalen) relativen Pfad sein. Er kann jede generelle URL sein, solange er vom Aufruf `jQuery.get` verstanden wird, um den entsprechenden Inhalt zu holen.

Jede *relative* Markdown Bild (oder Link) URL wird relativ zur Basis von `urlMd` interpretiert; jede *absolute* URL, welches mit `protocol://` (z.B. `http://`, `https://` oder `file://`) beginnt, wird unverändert übernommen.

Jede URL, die mit einem *Slash* `/` beginnt ist relativ zur dizmo Basis: So können Assets, welche im dizmo eingebettet sind, geholt werden. Um z.B. das eingebettete `md-logo.svg` Bild zu referenzieren:


    /bundles/com.dizmo.markdownreader_ng/assets/img/md-logo.svg

**Info:** Jedes HTML (oder CSS) Schnipsel kann frei mit dem MD Inhalt gemischt werden. Allerding sollte das so weit wie möglich vermieden werden und wir raten dazu, die native MD Schreibweise zu nutzen. Der `MarkdownReader` selbst nutzt einige wenige solche Schnipsel wie das `#pager` für die Weiter und Zurück Schaltflächen oder das `hooks.js` Script.

<!-- ====================================================================== -->

## <!-- Empty H2 -->

Der Inhalt wird in der MD Schreibweise verfasst: Er wird entweder durch eine absolute URL oder einem relativen Pfad zur Verfügung gestellt, der eine `${LANGUAGE}` Variable für Sprachenübersetzung haben kann.

<!-- ---------------------------------------------------------------------- -->

### CSS styling

Wenn Sie den Wert des Schlüssels `urlCss` auf `assets/css/reader.css` setzen, können Sie den Inhalt gestalten. Wie mit dem Schlüssel `urlMd` können Sie den Wert auf jede URL setzen für Ihr eigenes CSS. Die Datei `reader.css` importiert `assets/css/reader-base.css`, das einige basische Style Definitionen enthält. Im allgemeinen sollte `assets/css/reader-base.css` immer importiert werden.

Die folgenden HTML Identifiers or Klassen können genutzt werden, um die verschiedenen Aspekte des `MarkdownReader` zu gestalten: `#content`, `#md-toc`, `#md-toc-home`, `.md-toc-item`, `.md-toc-h1` ... `.md-toc-h5`, `#pager`, `#pager-lhs` und `#pager-rhs`.

<!-- ====================================================================== -->

## <!-- Empty H2 -->

Wenn Sie `#pager` HTML setzen, wird der Inhalt unterhalt der Headers der Ebene *H3* geteilt und als separate Seiten dargestellt.

<!-- ---------------------------------------------------------------------- -->

### Paginierung

Der Inhalt kann mit Seiten strukturiert werden, indem Sie `#pager` HTML zuunterst einer MD Datenquelle setzen.

```
<div id="pager">
  <span id="pager-rhs" rel="next"></span>
  <span id="pager-lhs" rel="prev"></span>
</div>
```

Falls der Seitenwechsel angezeigt, die Weiter und Zurück Schaltflächen jedoch nicht erwünscht sind, können letztere mit einem eingebetteten CSS versteckt werden:

```
<div id="pager" style="display: none !important">
  <span id="pager-rhs" rel="next"></span>
  <span id="pager-lhs" rel="prev"></span>
</div>
```

Wenn die Paginierung angeschaltet ist, wird der Inhalt unterhalt der Headers der Ebene *H3* geteilt und als separate Seiten dargestellt! Wir raten, den MD Inhalt entsprechend aufzuteilen.

<!-- ====================================================================== -->

## <!-- Empty H2 -->

Der Inhalt unmittelbar unterhalb H1 (oder H2) Headers ist statisch, d.h. er wird jeweils auf jede H2 (oder H3) Unterseite angezeigt.

<!-- ---------------------------------------------------------------------- -->

### Markdown Headers

Um zum Beispiel das *gleiche* Video (oder Bild) auf mehreren Seiten, dh. H3 Headers, anzuzeigen, wird es im MD Inhalt zwischen H2 und dessen ersten (falls vorhanden) H3 Sub-Header platziert.

Ähnlich wird der Inhalt zwischen H1 und dessen ersten (falls vorhanden) H2 Sub-Header auf *allen* Seiten dargestellt. Dies funktioniert nur, wenn Paginierung angeschaltet ist.

Im allgemeinen raten wir, die H2 Header leer zu lassen, wegen der Paginierung und des statischen Inhalts zwischen H2 and H3 Headers (oder H1 und H2).

<!-- ====================================================================== -->

## <!-- Empty H2 -->

Wenn das `assets/js/hooks.js` Script gesetzt ist, können Sie interaktiven Inhalt implementieren.

Der Inhalt kann mit Seiten strukturiert werden, indem Sie `#pager` HTML zuunterst einer MD Datenquelle setzen.
<!-- ---------------------------------------------------------------------- -->

### JavaScript Hooks

Wenn die Paginierung angeschaltet ist, löst der `MarkdownReader` die Events `turn:before` und `turn.after` aus, wenn umgeblättert wird. Die folgenden Code Schnipsel veranschaulichen, wie zu Sie diese Events abonnieren können (Subscription).
W

```
jQuery('#pager').on('
    turn:before', function (event, new_page, page) {
        // ..
    }
);
```

und:

```
jQuery('#pager').on('
    turn:after', function (event, new_page, page) {
        // ..
    }
);
```

Sie können z.B. ein Overlay anzeigen, wenn der `MarkdownReader` gestartet wird, indem Sie das Event `turn:before` abonnieren.

Beim Start (oder wenn die Schaltfläche `#md-toc-home` geklickt wird), ist der Parameter `page` nicht definiert, ansonsten beinhaltet er den Index der aktuellen Seite.

Sie können auch weitergehende Hooks definieren, indem Sie die folgende Funktion überschreiben:

```
MarkdownReader.my.lhsPageTo = function (page, pages, go) {
    // ..
}
```

und:

```
MarkdownReader.my.rhsPageTo = function (page, pages, go) {
    // ..
}
```

Mit diesen beide Funktionen können Sie die Paginierung blockieren, bis eine bestimmte Bedingung erfüllt ist. Diese sind unabhängig von den vorgehenden Funktionen und beide Sets können parallel genutzt werden.

Lesen Sie `assets/js/hooks.js` für mehr Informationen.

<!-- ====================================================================== -->

## <!-- Empty H2 -->

Das Inhaltsverzeichnis (TOC) Panel auf der rechten Seite kann an und abgestellt werden mit Hilfe des dizmo Menus.

<!-- ---------------------------------------------------------------------- -->

### TOC panel

Der Wert des Schlüssels `tocFlag` in der Konfigurationsdatei `assets/settings.json` kann auf `true`, `false` oder `null` gesetzt werden. Wenn der Wert auf `true` gesetzt ist, ist das TOC angeschaltet und wird anfangs auch angezeigt, bei `false`, ist es zwar an, wird beim Start aber nicht angezeigt, und auf `null` ist es komplett abgeschaltet und wird nie angezeigt.

Das TOC enthält die folgenden HTML Tags: `#md-toc`, `#md-toc-home`, `#md-toc-search`, `.md-toc-item` und `.md-toc-h1` .. `.md-toc-h5`. Die Header Tags werden nur angezeigt, wenn sie im MD Inhalt genutzt werden.

<!-- ====================================================================== -->

## <!-- Empty H2 -->

Die Inhalt- und Verzeichnis-Panels können scrollen.

<!-- ---------------------------------------------------------------------- -->

### Scrolling

Wenn Sie die Werte der jeweiligen Schlüssel `scroll1` und `scroll2` auf `false` oder auf ein entsprechendes Konfigurationsobjekt setzen, wird Scrolling in den Inhalts- und TOC-Panels abgeschaltet.

Mit dem Konfigurationsobjekt können Sie das Scrollen sehr fein anpassen: Sie können die Standardeinstellung so belassen; um sie feiner einzustellen, lesen Sie mehr dazu: [iScrollJS][3].

<!-- ====================================================================== -->

## <!-- Empty H2 -->

Die Rückseite des `MarkdownReader` dizmos zeigt zwei Felder an, in denen die MD and CSS URLs eingegeben wird, und einen eingebetteten CSS Editor.

<!-- ---------------------------------------------------------------------- -->

### Rückseite

In den Feldern auf der Rückseite können die MD und CSS URLs eingegeben werden, um den `MarkdownReader` schnell anzupassen. Desweiteren kann mit dem eingebettete CSS Editor die Standard Styles angepasst werden.

Wenn Sie den Flag `showBack` auf `false` setzen, wird das Drehen auf die Rückseite abgestellt. Wenn Sie den Flag `showFront` auf `false` setzen, wird der entsprechende *Inhalt* Eintrag im dizmo Menu entfernt.

<!-- ====================================================================== -->

[1]: https://daringfireball.net/projects/markdown
[2]: https://www.git-scm.com/book/en/v2/Git-Tools-Submodules
[3]: http://iscrolljs.com

<!-- ---------------------------------------------------------------------- -->

<div id="pager">
  <span id="pager-rhs" rel="next"></span>
  <span id="pager-lhs" rel="prev"></span>
</div>

<script>
jQuery.get(
    '/bundles/com.dizmo.markdownreader_ng/assets/js/hooks.js'
).done(function (data) {
    eval(data); jQuery('#pager').trigger('turn:before', [0]);
});
</script>