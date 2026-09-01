/**
 * ============================================================================
 * Caster Voice OS Aikajanan Tietokanta - Suomi (FI)
 * Sisältää kaikki 4 kehitysaikakautta, 38 virstanpylvästä, alijärjestelmäkatsaukset,
 * tekniset opit ja kehittäjän matkapohdinnat.
 * ============================================================================
 */

window.TIMELINE_DATA = window.TIMELINE_DATA || {};

window.TIMELINE_DATA['fi'] = [
  {
    "era_key": "era_1_2024_foundations",
    "era_title": "Aikakausi 1: Alkuvaiheen perusta ja asennus (Touko 2024 - Elo 2024)",
    "date_range": "2024-05-12 – 2024-08-31",
    "theme_summary": "Siirtymävaihe vanhasta Windowsin puheentunnistuksesta (WSR/WSRMacros) moderniin Dragonfly/Caster-järjestelmään Kaldi ASR -puhemoottorilla. Aikakausi alkaa kokeiluilla words.txt-muuntimien parissa vanhojen foneettisten tottumusten siirtämiseksi, kehittyy natiivien Python Dragonfly -sääntöjen kirjoittamiseen, tunnistaa arkkitehtuurilliset rajat jatkuvan komennontunnistuksen (CCR) ja ei-CCR-kielioppien välillä, perustaa modulaariset sovelluskohtaiset ja globaalit sääntöhierarkiat, ottaa käyttöön Talon-foneettisen aakkoston äänirasituksen vähentämiseksi ja omaksuu Casterin ergonomiset oletusasetukset vanhojen WSR-kiertotapojen sijaan.",
    "milestones": [
      {
        "hash": "7888a3d",
        "date": "2024-05-12",
        "title": "Ensimmäinen commit ja repositorion alustus",
        "significance": "Repositorion perusasennus, joka loi caster_user_content-hakemistorakenteen ja merkitsi virallista siirtymistä pois Windowsin puheentunnistuksesta."
      },
      {
        "hash": "7b57f4b",
        "date": "2024-05-15",
        "title": "Näppäimistökartoitusten korvaaminen muuntimilla",
        "significance": "Ensimmäinen yritys siirtää lihasmuisti WSR:stä Casteriin käyttäen words.txt-muunninkorvauksia (esim. enter-painikkeen ja aakkosten kartoitus)."
      },
      {
        "hash": "a4978fd",
        "date": "2024-05-28",
        "title": "Räätälöity sääntö ikkunoiden vaihtamiseen",
        "significance": "Ensimmäinen työtilassa kirjoitettu itsenäinen Dragonfly Python -sääntö, joka toteutti 1-indeksoidun ja negatiivisen tehtäväpalkin ikkunavaihdon."
      },
      {
        "hash": "d461bbb",
        "date": "2024-06-02",
        "title": "F2-näppäimen lisäys CCR-säännöllä",
        "significance": "Arkkitehtuurillinen käännekohta: hajanaiset yksittäiset säännöt yhdistettiin yhtenäiseen globaaliin jatkuvan komennontunnistuksen (CCR) sääntöön."
      },
      {
        "hash": "840dbd5",
        "date": "2024-06-05",
        "title": "Sääntötiedostojen järjestely ja bringme-sovellusten laajennus",
        "significance": "Merkittävä koodikannan uudelleenjärjestely, joka erotti käyttäjäsäännöt omiin 'apps/'- ja 'global/'-hakemistoihin sekä laajensi sm_bringme-sovelluskäynnistintä."
      },
      {
        "hash": "053a2db",
        "date": "2024-05-31",
        "title": "Siirtyminen ShortIntegerRef-määritykseen ja VS Code -laajennukset",
        "significance": "Tunnistusviiveen optimointi korvaamalla standardi IntegerRef ShortIntegerRef-määrityksellä säännöissä ja esittelemällä VS Coden ruutunavigointi."
      },
      {
        "hash": "a35d3b1",
        "date": "2024-07-04",
        "title": "Talon-aakkoston käyttöönotto",
        "significance": "Siirtyminen perinteisestä NATO-aakkostosta Talon-puheaakkostoon, mikä paransi merkittävästi akustista erottuvuutta ja puhe-ergonomiaa."
      },
      {
        "hash": "c155dff",
        "date": "2024-07-11",
        "title": "Explorerin korvaus, sanojen päivitys ja modulaariset sääntöpaketit",
        "significance": "Sovellussääntöjen modulaarisointi erillisiksi Python-paketeiksi (apps/explorer, apps/firefox, apps/vscode) yhdistämis- ja kartoitussääntöineen."
      },
      {
        "hash": "d13987c",
        "date": "2024-07-25",
        "title": "Tilannepäivitys: Casterin oletusten omaksuminen WSR-kiertojen sijaan",
        "significance": "Ajattelutavan läpimurto: Kaldin akustinen tarkkuus poistaa raskaiden moniosaisten WSR-kiertotapojen tarpeen mahdollistaen lyhyemmät ja luonnollisemmat äänikomennot."
      },
      {
        "hash": "5a8e89e",
        "date": "2024-08-22",
        "title": "CCR-sääntö Microsoft Wordille",
        "significance": "Puhekoodausmallien laajentaminen työpöydän tekstinkäsittelyyn erottaen muotoilun ketjutettuihin CCR-komentoihin ja syvään käyttöliittymänavigointiin."
      },
      {
        "hash": "8df0a5a",
        "date": "2024-08-31",
        "title": "Räätälöidyn hiirivaihtoehtosäännön luominen ja aktivointi",
        "significance": "Casterin ylävirran koodin keventäminen korvaamalla epävakaat sisäänrakennetut hiirisäännöt virtaviivaisella, törmäysvapaalla räätälöidyllä säännöllä."
      }
    ],
    "subsystem_highlights": {
      "global_rules": [
        "Numeroitu tehtäväpalkin ikkunavaihto negatiivisen indeksoinnin tuella häntäikoneille.",
        "Ikkunoiden nelikenttäkiinnitys (snapping) 4-kvadrantin tasolla Casterin apufunktioilla.",
        "Globaalien komentojen jakaminen erillisiin global_ccr_extended_rule.py (ketjutettavat komennot) ja global_nonccr_extended.py (erilliset ikkuna- ja järjestelmätoiminnot) -tiedostoihin.",
        "Ilmaisinalueen (system tray) navigointi mahdollistaen taustasovellusten valinnan ja avaamisen indeksillä.",
        "Räätälöity sanapoistosääntö ('word_delete_rule') yhdistettynä globaaleihin sääntöihin.",
        "Kuvakaappauskomennot koko näytölle, aktiiviselle ikkunalle ja Windowsin Kuvakaappaustyökalulle.",
        "Räätälöity hiirivaihtoehtosääntö, josta poistettu ongelmalliset Douglas- ja Rainbow-ruudukkokartoitukset."
      ],
      "app_rules": [
        "Firefox: Monivälilehtinavigointi positiivisilla ja negatiivisilla numeroilla, Tree Style Tab -paneelin vaihto, osoitepalkin hakukyselyt suoritusta edeltävällä viiveellä ja sivustohyppylistat.",
        "VS Code: Moniruutuvaihto ja koon muutos, integroidun terminaalin kohdistus, rivivalinta ('selina'), viimeaikaisten tiedostojen pudotusvalikko, kansioiden sulkeminen ja Python-tulkin polun tekstinsyöttö.",
        "Office (MS Word & Outlook): Wordin tyylimuotoilut (otsikot, lihavointi, kursivointi, alleviivaus, ylä-/alaindeksit, fonttidialogi), valintanauhan käyttö, F6-ruutukierto ja Outlookin saapuneiden postien synkronointi.",
        "Explorer ja tiedostodialogit: Navigoinnin toistettavuus (monivaiheinen taaksepäin/ylös), hakemistohypyt ja mukautetut CCR-yhdistämissäännöt.",
        "Media ja sisältö: VLC-mediatoiston nopeudensäätö ja tiedostojen/kansioiden lataus; Clipchamp-aikajanan zoomausviiveet ja ominaisuusnavigointi; YouTuben nopeudensäädöt ja suorahaku.",
        "Verkkosivustot ja tekoälymallit: Räätälöidyt sivustosäännöt ChatGPT:lle, Google Geminille ja Microsoft Copilotille kohdistaen suoraan syötekehotelaatikkoon."
      ],
      "infrastructure": [
        "transformers/words.txt -tiedoston iteratiivinen hienosäätö foneettisten törmäysten poistamiseksi rikkomatta Dragonflyn ydinkielioppeja.",
        "settings/sm_bringme.toml -konfigurointi nopeille puheohjatuille sovelluskäynnistyksille ja verkkoportaaleille.",
        "Aktiivisten sääntöjen hallinta settings/rules.toml -sallintalistalla poistaen käytöstä käyttämättömät Caster-säännöt viiveen minimoimiseksi ja tahattomien laukaisujen estämiseksi.",
        "Hakemistorakenteen arkkitehtuuri: siirtyminen litteästä sääntöhakemistosta organisoituun hierarkiaan (apps/vscode/, apps/firefox/, apps/explorer/, apps/office/, global/, websites/)."
      ],
      "docs_and_research": [
        "README.md ja status-update-history.md seuraamassa reaaliaikaisia siirtymävirstanpylväitä WSR:stä Kaldiin.",
        "caster-study-notes.md taltioimassa sisäisiä oppeja Caster-kieliopin suorituksesta, merkkien suuraakkostuksesta ja muunninkäyttäytymisestä.",
        "ace-space-transform.md dokumentoimassa kielioppitörmäystutkimuksia sanamuunnosten ja ydinmääritysten välillä.",
        "Pystysuuntaisen tehtäväpalkin muistiinpanot ja kuvat esteettömistä visuaalisista asetteluista numeroituun puhevaihtoon."
      ]
    },
    "technical_lessons": [
      "Muunnintörmäykset vs. kielioppimääritykset: Yleisten sanojen suora korvaaminen words.txt-tiedostossa (kuten 'space' tai 'a') korruptoi Casterin yhdistelmäsääntöjä. Mukautetut Dragonfly-säännöt tarjoavat turvallisemman kapseloinnin.",
      "Jatkuvan komennontunnistuksen (CCR) rajoitteet: Sujuvaan ketjutettuun saneluun tarkoitetut komennot kuuluvat CCR-yhdistämissääntöihin; monimutkaista tilaa tai erillisiä näppäinsarjoja vaativat komennot kuuluvat ei-CCR-kartoitussääntöihin.",
      "Akustisen moottorin muutos (WSR vs. Kaldi): WSR vaati keinotekoisen pitkiä tai luonnottomia monisanaisia laukaisijoita väärien tunnistusten välttämiseksi; Kaldi havaitsee luotettavasti ytimekkäät, luonnolliset yksitavuiset sanat äänihuulia rasittamatta.",
      "Foneettisen törmäyksen virheenkorjaus: Yksittäisten sanojen foneettiset päällekkäisyydet vaativat iteratiivista uudelleennimeämistä ('puts' -> 'spark', 'drip', 'fine').",
      "IntegerRef-viive: Yleisen IntegerRef-määrityksen korvaaminen ShortIntegerRef-määrityksellä vähentää merkittävästi tunnistusviivettä numeroparametroiduissa puhekomennoissa.",
      "Ajoitus ja asynkroninen käyttöliittymäkohdistus: Graafisiin käyttöliittymäsyötteisiin (kuten Firefoxin osoitepalkkiin) kohdistuvat puhekomennot vaativat harkittuja millisekuntiviiveitä ennen tekstin syöttämistä alkukirjainten putoamisen estämiseksi."
    ],
    "journey_quotes": [
      "Lisäsin kuvaavampia kommentteja ja huomautuksen tiedoston alkuun selittäen, etten täysin tiedä mitä teen ja että lisäykseni sanatiedostoon eivät tuota toivottua vaikutusta.",
      "Halusin alun perin vain ohittaa fraasit... mutta aloin ymmärtää, että osa näppäinpainalluksista ei kuulu jatkuvaan komennontunnistukseen, jolloin sana 'press' on sanottava etukäteen... Toivottavasti saan tämän korjattua seuraavassa commitissa.",
      "Sen sijaan, että muuttaisin sanan 'spark' sanaksi 'puts', opettelen tästä eteenpäin käyttämään fraasia 'spark' tekstin liittämiseen. Olen alkanut ymmärtää, että moni Casterin oletussanoista on valittu toimintoihin erittäin hyvästä syystä.",
      "Sovellusten vaihtamisessa vaihdoin aloitusfraasiksi 'drip' 'switch':in sijaan virhetunnistusten vuoksi ja koska palaan sanomaan 'dredge' 'switchback':in sijaan vähentääkseni äänirasitusta ja yksinkertaistaakseni käyttöä.",
      "Ajan myötä olen alkanut arvostaa tiettyihin toimintoihin valittuja määrityksiä ja ymmärtänyt, että Windowsin puheentunnistusmakroissa käyttämiäni sanoja ei kannata käyttää Casterissa, koska parempi moottori tunnistaa yksinkertaisempia sanoja.",
      "Nyt kun olen tottunut sanomaan sanan 'fine' 'fox':in sijaan kirjaimelle f, aiempaa virhetunnistusta sanaksi 'focus' ei enää esiinny, ja poistan 'toggle'-sanan, joka oli lisätty korjaamaan tuota poistunutta ongelmaa.",
      "Sisäänrakennetun hiirivaihtoehtosäännön Douglas-kartoituksen virhetunnistusten vuoksi loin räätälöidyn säännön, josta tuo toiminto ja toimimaton Rainbow-ruudukko on poistettu."
    ]
  },
  {
    "era_key": "era_2_2024_expansion",
    "era_title": "Aikakausi 2: Työnkulkujen laajennus ja foneettinen kehitys (Syys 2024 - Joulu 2024)",
    "date_range": "2024-09-01 – 2024-12-31",
    "theme_summary": "Aikakausi 2 edustaa laajamittaista laajentumisvaihetta, jota vauhdittivat diplomityön/opinnäytetyön kirjoittaminen ja täysin esteettömät työpöytätyönkulut. Repositorio laajeni perusnavigoinnista syvään sovellusautomaatioon Microsoft Officessa (Word, PowerPoint, Excel, Outlook), LibreOfficessa (Writer, Calc), IDE-ympäristöissä (siirtyminen VS Codesta VSCodiumiin pudonneiden merkkien korjaamiseksi) ja pääteympäristöissä. Samanaikaisesti kehittäjä hioi intensiivisesti sanoja ja komentomäärityksiä Kaldin akustisten törmäysten ratkaisemiseksi, jakoi monoliittiset globaalit säännöt modulaarisiin alijärjestelmiin (tehtäväpalkki, CLI, ohjelmointi) ja loi tiukat yksityisyysrajat ympäristömuuttujilla.",
    "milestones": [
      {
        "hash": "e9ef954",
        "date": "2024-09-30",
        "title": "Ikkunavaihdon siirtäminen omaan sääntöönsä ja erilliseen tiedostoon",
        "significance": "Aloitti arkkitehtuurillisen modulaarisoinnin erottamalla ikkuna- ja tehtäväpalkkihallinnan monoliittisista globaaleista säännöistä erilliseen taskbar.py-sääntöön numeroidulla tehtäväpalkki-indeksoinnilla (1–9)."
      },
      {
        "hash": "00b8d30",
        "date": "2024-10-09",
        "title": "VSCodium-säännön päivitys ja vscodium_ccr-säännön luominen",
        "significance": "Toteutti siirtymisen VS Codesta VSCodiumiin syöttöviiveongelman ohittamiseksi, jossa Quick Open pudotti alkukirjaimia puhesanelun aikana."
      },
      {
        "hash": "ffc0105",
        "date": "2024-10-09",
        "title": "Asetustiedostojen versionhallinnan lopettaminen",
        "significance": "Tietoturva- ja yksityisyysvirstanpylväs poistamalla paikalliset konekohtaiset asetukset (settings/*.toml) seurannasta yksityisten polkujen suojaamiseksi."
      },
      {
        "hash": "cffb0b8",
        "date": "2024-11-18",
        "title": "enable_viacam.py-päivitys ja .gitattributes-tiedoston luonti",
        "significance": "Standardoi rivinvaihdot Windows-kehitysympäristöissä .gitattributes-tiedostolla ja integroi esteettömän pääseurantahiiriohjauksen (enable_viacam.py) CCR-yhdistämissääntöihin."
      },
      {
        "hash": "97b03b3",
        "date": "2024-11-22",
        "title": "file_dialog.py- ja .gitignore-päivitys",
        "significance": "Suunnitteli environment_variables.py-mallin (.gitignore-tiedostossa), jonka avulla puhesäännöt voivat viitata turvallisesti yksityisiin tiedostopolkuihin ja henkilökohtaisiin tietoihin."
      },
      {
        "hash": "4a10773",
        "date": "2024-11-26",
        "title": "Programming-hakemiston luominen globaalilla säännöllä ja mukautetuilla Python-säännöillä",
        "significance": "Strukturoi modulaarisen programming/-alueen yhdistäen CCR-muotoillut operaattorit (+=, !=, ->, ==) ja mukautetut Python-säännöt pois sovelluskohtaisista kieliopeista."
      },
      {
        "hash": "437e475",
        "date": "2024-12-06",
        "title": "excel.py-säännön päivitys",
        "significance": "Voitti sovelluskontekstien sidontaongelmat määrittämällä suoritettavat tiedostot eksplisiittisesti, avaten laajan taulukkolaskenta-automaation Excelissä ja LibreOffice Calcissa."
      },
      {
        "hash": "7b8c049",
        "date": "2024-12-12",
        "title": "WriterCCR-säännön luominen",
        "significance": "Laajensi puhekoodauskieliopin LibreOffice Writeriin yhdistetyillä ei-CCR- ja jatkuvan komennontunnistuksen (CCR) kieliopeilla nopeaan dokumenttien muotoiluun."
      },
      {
        "hash": "6a14fcd",
        "date": "2024-12-23",
        "title": "Windows Terminal -komentojen siirto cli_ccr-sääntöön",
        "significance": "Konsolidoi pirstaleiset päätesäännöt (Git Bash, Windows Terminal, CMD) yhtenäiseen cli-alueeseen tukien eri komentotulkkeja ja SQLiteä."
      }
    ],
    "subsystem_highlights": {
      "global_rules": [
        "Ikkunavaihto ja ilmaisinalueen toiminnot erotettu omaan taskbar.py-tiedostoon 1–9 tehtäväpalkki-indeksoinnilla.",
        "Moninäyttöhallinta, mukaan lukien kursorin keskittäminen ensisijaiselle/toissijaiselle näytölle ja Caster-terminaali-ikkunan kiinnitys työtiloihin.",
        "Näytön neljännes- ja kuudesosakohdistus sekä vieritystoiminnot tiedostoissa global_nonccr_extended.py ja global_ccr_extended_rule.py.",
        "Tekstinsyöttömakrot ympäristömuuttujille (henkilökohtaiset tunnistetiedot, opinnäytetyön vakiotekstit) ja LLM-kehotepikanäppäimet (kieliopin tarkistus leikepöydältä, 40-merkin muotoilu)."
      ],
      "app_rules": [
        "Office-ohjelmistot: Syvä MS Word- ja PowerPoint-automaatio mukaan lukien valintanauhan näppäinvihjeet, taulukoiden luonti/muotoilu, kommenttien hallinta, diojen käsittely ja ääneenlukutoiminnot.",
        "LibreOffice: Omat säännöt Calcille ja Writerille (writer.py, writer_ccr.py) tukien tyyliotikoita, PDF-vientiä, rivinumerointia ja solujen automaattisovitusta.",
        "Selaimet: Laajennettu Firefox suorilla osoitepalkin hakukyselyillä (Reddit, YouTube, kirjanmerkit, historia uusissa välilehdissä/ikkunoissa), Tree Style Tab -viiveillä ja sivustonavigointilistoilla.",
        "Kehittäjätyökalut: Siirrytty VSCodiumiin (vscodium.py, vscodium_ccr.py), lisätty Notepad++ DBGp-liitännäistuella, luotu Vim-tilan säännöt (vim.py, vim_ccr.py) ja yhdistetty CLI/Terminal-säännöt (cli.py, cli_ccr.py).",
        "Verkkosivustot: Lisätty sovellussäännöt tekoälykeskusteluille (Copilot, Gemini) ja koodausalustoille (LeetCode)."
      ],
      "infrastructure": [
        "Otettu käyttöön seuraamaton environment_variables.py ja päivitetty .gitignore estämään paikallisten polkujen vuotaminen julkisiin repositorioihin.",
        "Poistettu settings/*.toml seurannasta paikallisen työasemakonfiguraation erottamiseksi sääntökoodista.",
        "Lisätty .gitattributes yhdenmukaistamaan rivinvaihdot Windows-kehitysympäristöissä.",
        "Luotu programming/-pakettihakemisto kielikohtaisille (python.py, python_ccr.py, standard.py) ja globaaleille ohjelmointioperaattoreille."
      ],
      "docs_and_research": [
        "Laajat koodikommentit ja sääntörakenteet, jotka laadittiin sisällytettäväksi koodiesimerkeiksi tekijän opinnäytetyöhön.",
        "Luotu esimerkkisääntöjä (esim. ms_word_example.py) ja muotoiltu Choice-valinnat tiiviisti opinnäytetyön sivunasettelurajoitusten mukaisesti.",
        "Opinnäytetyövetoiset työnkulkujen optimoinnit (navigointipaneelin otsikot, taulukoiden otsikot, sisällysluettelopäivitykset ja lähteiden hallinta)."
      ]
    },
    "technical_lessons": [
      "Sanelun ja komentojen törmäykset: Lyhyet yksitavuiset komennot törmäävät helposti luonnolliseen saneluun. Tiheätaajuinen sanasto on erotettava yhdistelmämäärityksillä kuten 'switch focus' tai 'name flash'.",
      "Foneettinen viritys on iteratiivista: Toimivien foneettisten ankkureiden löytäminen navigointinäppäimille vaatii jatkuvaa kokeilua Kaldin akustisia malleja vasten.",
      "Simuloitujen näppäinpainallusten ajoitus: Nopea näppäinpainallusten syöttö Electron-sovelluksiin / IDE-ympäristöihin voi pudottaa alkukirjaimia ilman näppäinkohtaisia viiveitä tai siirtymistä herkempiin koontiversioihin (VSCodium).",
      "Sovelluskontekstin määrittely: Pelkät ikkunoiden otsikot ovat hauraita; sääntöjen on sidottava eksplisiittisesti suoritettavien tiedostojen nimiin (esim. excel.exe) luotettavan kohdistuksen takaamiseksi.",
      "Modulaarinen sääntöarkkitehtuuri: Komentojen kerryttäminen global_nonccr_extended.py-tiedostoon luo nopeasti teknistä velkaa; ennakoiva eriyttäminen toimialuemoduuleihin (taskbar.py, cli.py, programming/) on välttämätöntä skaalautuvuudelle."
    ],
    "journey_quotes": [
      "Yritin lisätä mahdollisuuden avata tiettyjä tiedostonimiä sanelusyötteellä, mutta saan virheen, jossa osa kirjaimista puuttuu tulosteesta, joten aion siirtyä VSCodiumiin, jossa virhettä ei esiinny (2024-09-18, commit 102f737)",
      "Sanoissa: kamppailen edelleen Page Up- ja Page Down -komentojen kanssa, joten muutin Page Down -muunnokseksi 'fell' (2024-09-12, commit f0de3b7)",
      "Lisäsin mahdollisuuden peilata toissijaisella näytöllä käyttämäni ikkunan kaikkiin työtiloihin, jotta Casterin tulosteen näyttävä pääteikkuna on aina näkyvissä myös työtiloja vaihdettaessa (2024-09-12, commit a3b0618)",
      "Muutin komentomäärityksen 'flash' muotoon 'name flash', koska sen ei tarvitse olla yksitavuinen sana, kun en käytä sitä niin usein, ja se tunnistui toisinaan virheellisesti muista komennoista (2024-10-05, commit 4171d21)",
      "Muutin komentomäärityksen 'focus' muotoon 'switch focus', koska sitä ei sanota niin usein ja joskus se suoriutui vahingossa yrittäessäni sanella sanaa 'focus' (2024-10-06, commit 1a2cb88)",
      "Lisäsin kuvaavampia kommentteja hunt-and-peck-aktivointiin, koska tarvitsin koodinpätkän opinnäytetyöhöni (2024-10-01, commit 8078f7c)",
      "Lisäsin tilapäisiä komentoja toistuville tekstinpätkille, joita minun on jatkuvasti lisättävä opinnäytetyöhöni (2024-11-04, commit 1ea8c05)",
      "Loin ympäristömuuttujatiedoston yksityisten tiedostopolkujen tuomiseen, joita en halua julkaista julkisesti, ja lisäsin sen .gitignore-tiedostoon (2024-11-22, commit 97b03b3)",
      "Ymmärsin, että syy miksi sääntö ei toiminut oli se, ettei se ollut aktivoitu, joten muutin sääntötiedot sisältämään suoritettavan tiedoston (2024-12-06, commit 437e475)",
      "Sen sijaan, että minulla olisi oma sääntö jokaiselle pääteohjelmalle, aloitan yleisellä CLI-säännöllä toistaiseksi (2024-12-23, commit 6a14fcd)"
    ]
  },
  {
    "era_key": "era_3_2025_maturity",
    "era_title": "Aikakausi 3: Kielioppien kypsyminen ja sääntöjen hionta (Tammi 2025 - Marras 2025)",
    "date_range": "2025-01-01 – 2025-11-30",
    "theme_summary": "Aikakausi 3 merkitsee merkittävää harppausta järjestelmän kypsyydessä, vasteajassa ja laajuudessa. 454 committia 11 kuukauden aikana kattava aikakausi muutti Casterin puhekoodauksen perusympäristöstä läsnäolevaksi, optimoiduksi multimodaaliseksi käyttöjärjestelmäksi. Keskeisiä arkkitehtuurillisia painopisteitä olivat: (1) Järjestelmänlaajuinen viiveen poisto nollaviivetekstinsyötöllä (pause=0.0) ja leikepöytäinjektiopuskureilla; (2) Syvä integraatio generatiivisen tekoälyn koodausparadigmoihin (Cursor, Windsurf, Copilot Desktop, Claude ja paikalliset Ollama/DeepSeek CLI -työnkulut); (3) Vankka jatkuva komennontunnistus (CCR) erikoistuneissa sovelluksissa kuten LibreOffice Writer, Figma, PowerShell ja MS Word; (4) Edistynyt käyttöjärjestelmätason ikkunanhallinta Windows 11:n foreground-lock-rajoitusten ohituksella ja UI Automation -tehtäväpalkkitarkastelulla; ja (5) Multimodaalinen fyysinen laajennus Olympus RS31H -jalkapolkimen automaatiolla ja AutoHotkey v2:lla.",
    "milestones": [
      {
        "hash": "8c0faea",
        "date": "2025-01-14",
        "title": "VSCodium-sääntöjen päivitys sisältämään Cursor-tunnistuksen",
        "significance": "Aloitti nopean siirtymisen tekoälyvetoisiin IDE-ympäristöihin laajentaen VS Coden kielioppisäännöt tunnistamaan Cursorin ja luoden pohjan omille tekoälyeditorisäännöille."
      },
      {
        "hash": "21e76c7",
        "date": "2025-03-05",
        "title": "PowerShell-komentojen optimointi nollaviivetekstinsyötöllä",
        "significance": "Läpimurtoviiveen pudotus ohittamalla Dragonflyn oletuskirjoitusviive pause=0.0-määrityksellä pääte-, editori- ja selainsäännöissä tehden puhekomennoista välittömiä."
      },
      {
        "hash": "8a587eb",
        "date": "2025-03-04",
        "title": "Windsurf CCR -säännön ja tiedostokontekstikomentojen lisäys",
        "significance": "Perusti ensiluokkaisen jatkuvan komennontunnistuksen (CCR) Codeiumin Windsurf IDE:lle integroiden puhemakrot tekoälykonteksti-ikkunoihin ja Cascade-työnkulkuihin."
      },
      {
        "hash": "ba05776",
        "date": "2025-04-15",
        "title": "text_to_clipboard-apuohjelman lisäys ja commit-kehoteluonnin optimointi",
        "significance": "Arkkitehtuurillinen siirtymä merkki-merkiltä-tekstisimulaatiosta atomiseen leikepöytäinjektioon (Function(text_to_clipboard) + Ctrl+V) pitkille strukturoiduille kehotteille ja commit-viesteille."
      },
      {
        "hash": "97c10b7",
        "date": "2025-06-28",
        "title": "Alt-näppäinkiertotapa Windowsin foreground-lockille ikkunavaihdossa",
        "significance": "Ratkaisi käyttöjärjestelmän keskeisen rajoituksen, jossa Windows 11 estää taustaprosesseja nostamasta ikkunoita, injektoimalla keinotekoisia Alt-näppäinpainalluksia käyttäjävuorovaikutusvaatimuksen täyttämiseksi."
      },
      {
        "hash": "b2a2015",
        "date": "2025-08-08",
        "title": "Ikkunanhallintakoodin siirtäminen attic-arkistoon",
        "significance": "Pragmaattinen arkkitehtuurillinen vetäytyminen: kunnianhimoinen abstrakti ikkunanhallinnan taustarajapinta hylättiin ja arkistoitiin yksinkertaisempien ja luotettavampien UI Automation -tehtäväpalkkirutiinien tieltä."
      },
      {
        "hash": "2c6a9af",
        "date": "2025-09-15",
        "title": "Olympus RS31H -jalkapoljinohjauksen lisäys AutoHotkey v2:lla",
        "significance": "Laajensi puheympäristön multimodaaliseen fyysiseen tietojenkäsittelyyn esitellen suodatetut laitteistojalkapolkimen laukaisimet älykkäälle vetoklikkaukselle ja jatkuvalle vieritykselle."
      },
      {
        "hash": "f60c3f9",
        "date": "2025-09-17",
        "title": "Ikkunavaihdon ja tehtäväpalkkavuorovaikutuksen refaktorointi",
        "significance": "Korvasi hauraan control.invoke()-kutsun control.click_input()-kutsulla ikkunakohdistuksessa eristäen Dragonflyn 'Cannot add list while loaded' -dynaamisen kielioppirajoitteen."
      },
      {
        "hash": "1d4efba",
        "date": "2025-10-08",
        "title": "Figma-puhekomentosäännön ja CCR-tuen lisäys",
        "significance": "Laajensi puhekoodauksen kielioppiperiaatteet visuaaliseen suunnitteluun mahdollistaen jatkuvan komentoketjutuksen, kankaan panoroinnin/zoomauksen ja spatiaaliset muunnoskieliopit (rake/lake, stretch/squeeze)."
      },
      {
        "hash": "fe2ec4d",
        "date": "2025-11-21",
        "title": "UV-paketinhallintakomentojen lisäys PowerShell-sääntöön",
        "significance": "Modernisoi Python CLI -työkaluketjun sisällyttämällä Astralin huippunopean uv-paketinhallinnan päivittäisiin puheaktivoituihin päätetyönkulkuihin."
      }
    ],
    "subsystem_highlights": {
      "global_rules": [
        "Laaja CCR-laajennus global_ccr_extended_rule -tiedostossa ohjelmointioperaattoreilla ('==', '|', ':'), navigointisarjoilla ja suomalaisten merkkien syöttötuella.",
        "Windows 11 -integraatio global_nonccr_extended -tiedostossa: näytön kirkkauden esiasetukset (25%, 50%, 75%), Windowsin Äänenvoimakkuuden mikseri, Yövalo-kytkin, Kuvakaappaustyökalu ja työtilojen peilaus kahdella näytöllä.",
        "Edistynyt ikkunavaihdin (window_switching.py ja window_switching_ccr.py) Alt-näppäimen foreground-lock-kierroilla ja ExplorerPatcher-tehtäväpalkkielementtien tunnistuksella."
      ],
      "app_rules": [
        "Tekoäly- ja editoriekosysteemi: Moni-IDE-tuki kattaen VS Coden, Cursorin, Windsurfin, Notepad++:n ja IntelliJ:n erikoispuhekomennoilla tekoälysivupalkeille, pikamuokkauksille ('edit here' / 'reject that') ja Composer-paneeleille.",
        "Pääte ja komentotulkki (PowerShell & Windows Terminal): Nollaviivesuoritus, hakemistopino (pushd/popd), Ollama-paikallismallien hallinta (serve, run, ps, deepseek), Docker/n8n-suoritus, Python REPL -ohjaus ja uv-paketinhallinta.",
        "Selaimet (Firefox & MS Edge): Selainvälilehtien jako ('sprite'), historiahaku ('hispell'), kehittäjätyökalujen navigointi, osoitepalkin pikakopiointi ja Waterfox-kaksoisselaintuki.",
        "Toimisto- ja dokumenttiohjelmat: Kypsä puheohjaus LibreOffice Writerissa (taulukon rivien/sarakkeiden lisäys, solujen yhdistäminen, kirjanmerkkihypyt) ja MS Officessa (Wordin CCR-otsikot, Excelin sarakekäsittely, Outlookin kalenteri- ja sähköpostiautomaatio).",
        "Luovat ja apuohjelmat: Figma-suunnittelusäännöt (vektoripanarointi/zoomaus, lisäosat kuten Coolors ja Unsplash), QuickPictureViewer-kuvankäsittelyt, Telegram-keskustelunavigointi, Zoom/Meet-ohjaimet ja Scrcpy Android -näytön etävuorovaikutus."
      ],
      "infrastructure": [
        "Yksityisyyslähtöinen konfiguraation eristys: Keskitetty environment_variables.py paikallisille tiedostopoluille, yksityisille repositorioille, sähköpostiallekirjoituksille ja commit-kehotemuodostimille.",
        "Optimoitu tekstinsyöttöarkkitehtuuri: util/text.py (text_to_clipboard) korvaamassa raskaat näppäimistöemulaatiot välittömillä käyttöjärjestelmän leikepöytäpuskureilla.",
        "UI Automation -tehtäväpalkkimoottori: util/taskbar.py uudelleenkirjoitettu käyttämään control.click_input()-kutsuja ja jälkeläishakuja luotettavaan prosessi-ikkunoiden kohdistamiseen.",
        "Arkkitehtuurillinen karsinta: Poistettu monimutkaiset abstraktioyritykset (WindowBackend) ja arkistoitu ne siististi attic/-hakemistoon suoritusajan pitämiseksi puhtaana."
      ],
      "docs_and_research": [
        "Kattava laitteisto-opas: Lisätty yksityiskohtainen dokumentaatio ja asennusohjeet Olympus RS31H -jalkapolkimen konfigurointiin AutoHotkey v2:lla.",
        "Repositoriodokumentaatio: Uudistettu README Caster-puhemoottorin yleiskatsauksella, Enable ViaCam -pääseurantaohjeilla ja selkeillä arkkitehtuurirajoilla.",
        "Tehtävä- ja työnkulkuseuranta: Integroitu Trello CLI -puhetyönkulut ja dokumentoitu kehotemuotoilumallit commit-viestien luontiin."
      ]
    },
    "technical_lessons": [
      "Näppäinpainallusviiveen eliminointi: Puhemoottoreiden oletuskirjoitusviiveet aiheuttavat havaittavaa nykimistä; pause=0.0-määrityksen asettaminen ja leikepöytäinjektion hyödyntäminen (text_to_clipboard + Ctrl+V) on pakollista sujuvalle puhekoodaukselle.",
      "Dragonflyn dynaamisen listan rajoitteet: Dragonflyn Grammar Manager heittää virheen 'Cannot add list while loaded' yritettäessä rekisteröidä dynaamisesti listoja aktiivisiin kielioppeihin ajon aikana, mikä vaatii staattista alustusta tai täysiä kieliopin uudelleenlatauksia.",
      "Windows 11 UI Automation -erikoisuudet: Suora käyttöliittymäelementin kutsu (control.invoke()) epäonnistuu usein etualan kohdistuksen myöntämisessä Windows 11:ssä; control.click_input()-kutsun käyttö yhdistettynä keinotekoisiin Alt-näppäinpulsseihin ohittaa tehokkaasti Windowsin foreground-lock-rajoitukset.",
      "Tekoäly-IDE-automaattitäydennysten törmäykset: Suurnopeuksiset tekoälytäydennykset (esim. Windsurf / Cursor) voivat hiljaisesti ylikirjoittaa puhesääntömuutoksia, mikä johti puheaktivoitujen täydennyskytkimien luomiseen ('snooze auto' / 'unsnooze auto').",
      "Pragmatismi yli-insinöörityön edelle: Raskaat abstraktiokerrokset lisäsivät arkkitehtuurillista kitkaa parantamatta luotettavuutta; niiden arkistointi ja suorien apufunktioiden suosiminen osoittautui ylivoimaiseksi ratkaisuksi."
    ],
    "journey_quotes": [
      "Ilmeisesti tämä muutos oli toteutettu aiemmassa commitissa, mutta Windsurfin automaattitäydennys poisti sen jossain vaiheessa enkä huomannut sitä (Commit 4e6c718)",
      "Poistin ikkunoiden aliastoiminnon 'Grammar Manager: Cannot add list while loaded' -virheen vuoksi... Koodi on säilytetty kommenteissa tulevaa uudelleenaktivointia varten, kun oikea ratkaisu löytyy (Commit f60c3f9)",
      "Lisäsin Alt-näppäinkiertotavan Windowsin foreground-lockille ikkunavaihdossa: Windows estää taustasovelluksia asettamasta etualan ikkunaa suoraan... Alt-näppäintapahtuman lähettäminen täyttää käyttöjärjestelmän vaatimuksen käyttäjän syötteestä (Commit 97c10b7)",
      "Lisäsin 'edit here' -komennon käyttäen Key('ca-k') Windsurfin pikamuokkaukseen ja 'reject that' -komennon ehdotettujen muutosten hylkäämiseen... tehden tekoälyehdotusten hylkäämisestä intuitiivisempaa (Commit e0be76c)",
      "Toteutin älykkäät jalkapoljintoiminnot suodatuksella ja visuaalisella palautteella: Oikea poljin (F15): Älykäs vasen klikkaus vetotuella, Keskipoljin (F14): Vieritys alas jatkuvalla vierityksellä... (Commit 2c6a9af)",
      "Optimoitiin commit-kehotteen luonti korvaamalla Text('') funktiolla Function(text_to_clipboard) ja lisäämällä 20 ms tauko ennen leikepöydän liittämistä... nopeamman suorituksen ja luotettavuuden takaamiseksi (Commit ba05776)"
    ]
  },
  {
    "era_key": "era_4_2026_modern",
    "era_title": "Aikakausi 4: Moderni arkkitehtuuri, monisäikeistys ja syväanalyysit (Touko 2026 - Elo 2026)",
    "date_range": "2026-05-01 – 2026-08-31",
    "theme_summary": "Aikakausi 4 merkitsee syvää siirtymää käytännön sääntöjen rakentamisesta kohti syvää järjestelmäarkkitehtuuria, rinnakkaisuusohjelmointia ja tiukkaa empiiristä tutkimusta. Kohdattuaan hienovaraisia monisäikeistyksen lukkiutumisia ja puhemoottorin jumiutumisia kehittäjä käynnisti Socratic Wayfinder -tutkimushankkeen—kattavan 38 tiketit tutkimusmatkan Microsoft COM STA/MTA -säiemalleihin, avustavan teknologian arkkitehtuureihin (NVDA, Terminator, UFO) ja Model Context Protocol (MCP) -palvelimiin. Ratkaisevassa empiirisen insinöörityön hetkessä yksityiskohtainen suoritusajan telemetria kumosi vallitsevan COM-lukkiutumishypoteesin tunnistamalla Windows PowerShell QuickEdit -konsolijäätymiset puhepinon jumiutumisen todelliseksi syyksi. Samanaikaisesti aikakausi ratkaisi kriittiset Kaldi FST -kääntäjän kilpatilanteet Dragonfly BPC -haarassa, esitteli 3-portaisen vikasietoisen ikkunavaihtimen virtuaalityöpöytätietoisuudella (pyvda), suunnitteli erillisen XML-RPC IPC -mikrofonisillan Olympus RS31H -jalkapolkimelle ja suoritti syvällisen arvioinnin LexiconCode PR #881 -ehdotuksesta. Aikakausi huipentui dokumentaatiokokonaisuuden perinpohjaiseen uudistukseen, vakiinnuttaen 'docs/context/repository-brain.md' -tiedoston arkkitehtuurilliseksi totuuden lähteeksi automatisoidulla CI-linkkivalidoinnilla ja tiukalla suhteellisten polkujen hygienialla.",
    "milestones": [
      {
        "hash": "afb6f63",
        "date": "2026-05-31",
        "title": "Ikkunavaihdon yhdistäminen syvään sovellusvaihdinmoduuliin 3-portaisella varajärjestelmällä",
        "significance": "Korvasi perinteiset tehtäväpalkkiskriptit yhtenäisellä 3-portaisella vikasietoisella ikkunakohdistusputkella (pywinauto-kohdistus -> tehtäväpalkin UIA-klikkaussimulaatio -> Win+T-näppäinmakro) ja palautti ikkuna-/välilehtialias-komennot."
      },
      {
        "hash": "f747d5a",
        "date": "2026-06-07",
        "title": "Caster-mikrofonin kytkennän IPC-integraatio ja jalkapoljinmuutosten dokumentointi",
        "significance": "Suunnitteli XML-RPC IPC -palvelimen localhost-porttiin 8341 saavuttaakseen välittömän, deterministisen mikrofonin lepo-/herätystilan vaihdon Olympus RS31H -jalkapolkimella ilman simuloituja näppäinpainalluksia."
      },
      {
        "hash": "3fcfd81",
        "date": "2026-07-07",
        "title": "Kaldi-moottorin kaatumisen juurisyyn dokumentointi ja UIA-tilaraportti",
        "significance": "Tunnisti ja korjasi kriittisen kilpatilanteen Dragonfly BPC -haarassa, jossa Kaldi-kielioppitarkkailijan elinkaariajoitus Mimic()-äänisiirtymien aikana aiheutti moottorin kaatumisia kesken lauseen."
      },
      {
        "hash": "2588603",
        "date": "2026-07-16",
        "title": "Dynaamisten sanelualiaiden lisäys ja paikallinen/etä-CI-validointiputki",
        "significance": "Mahdollisti lennosta tapahtuvan puhesanelun ikkuna-/välilehtialiaksille sekä perusti pre-commit- ja GitHub Actions CI -putket valvoen Ruff-linttausta, absoluuttisten polkujen vuodonestoa ja komentojen yksilöllisyyttä."
      },
      {
        "hash": "8645829",
        "date": "2026-08-04",
        "title": "Wayfinder-kartan luominen ja säieallas-ADR:n hylkääminen UIA-palvelinuudistuksessa",
        "significance": "Käynnisti Socratic Wayfinder -tutkimushankkeen ja poisti taustatyösäieallas-ADR:n käytöstä paljastettuaan Microsoft COM Single-Threaded Apartment (STA) -säierajoitteet."
      },
      {
        "hash": "ca5dc70",
        "date": "2026-08-08",
        "title": "COM-lukkiutumisten kumoaminen empiirisellä sovellusvaihdintutkimuksella ja telemetrialla",
        "significance": "Empiirinen ajoitustelemetria todisti, että aiemmin COM/UIA-lukkiutumisten syyksi luullut puhesäiejäätymiset johtuivat todellisuudessa Windows PowerShell QuickEdit -tilan konsolitulostuksen pysäyttämisestä tekstin valinnassa."
      },
      {
        "hash": "3d2965c",
        "date": "2026-08-12",
        "title": "Testauspalautteen ja kohdistusanalyysin lisäys LexiconCode PR #881 -ehdotukselle",
        "significance": "Tuotti arkkitehtuurillisen analyysin LexiconCode PR #881 -ikkunavaihdosta, vertaillen sen dynaamista regex-kyselyä Win32 AttachThreadInput -ohitukseen ja paljastaen Kaldin suoritusajan graafin uudelleenkääntämisen rajat."
      },
      {
        "hash": "770bdba",
        "date": "2026-08-14",
        "title": "Dokumentaatiohierarkian peruskorjaus ja repositorion aivojen (Brain) perustaminen",
        "significance": "Yhdisti pirstaleiset muistiinpanot ja tutkimukset strukturoiduksi dokumentaatiokeskukseksi 'docs/context/repository-brain.md' -tiedoston ympärille, tukenaan CI-linkkivalidointi ja työtilan yksityisyyssäännöt."
      }
    ],
    "subsystem_highlights": {
      "global_rules": [
        "Ikkunavaihto (window_switching.py, window_switching_ccr.py): Kehittyi tukemaan dynaamisia puhesaneltuja ikkuna- ja välilehtialiaksia ('set window <alias>', 'switch [to] <alias>', 'alias reset') ennalta määritetyn sanaston rinnalla.",
        "Tekstinmuokkaus (text_editing.py): Valmistui kokeellisista UIA-diagnostiikkaskripteistä tuotantosäännöksi tukien leikepöytävapaata merkki-/aluevalintaa luetellulla NATO-aakkostolla ja dynaamisella suuraakkostuksella.",
        "Ikkunoiden asettelu (global_nonccr_extended.py): Lisätty sanalliset laukaisimet asettelunhallintaan ('position retain', 'position restore', 'position list') ja monisuuntaiseen kiinnitykseen ('window split <dir> with <n>').",
        "Editori-integraatio (editor_commands.py): Siirretty keskeiset navigointitoiminnot Windsurfista Antigravity IDE:hen komentorivi-integraatiolla ja keskitetyillä ajokomennoilla."
      ],
      "app_rules": [
        "Antigravity IDE (antigravity.py, antigravity_ccr.py): Rakennettu kattavat tekoälykehityksen työnkulut mukaan lukien automatisoitu git-vaiheistus/commit-luonti ('/commit'), puhekeskustelun kohdistusmakrot (Ctrl+L / Ctrl+Shift+L) ja editoriruutujen hallinta.",
        "PowerShell ja Windows Terminal (powershell.py, windows_terminal.py): Lisätty kielikohtaiset koodikannan XML-paketoijat ('folder xml python [wrap]', 'folder xml see sharp [wrap]') saumattomaan LLM-kontekstisyöttöön sekä korotettujen oikeuksien prosessien lopetus.",
        "Firefox (firefox_extended_rule.py): Esitelty puheohjatut Gemini-tekoälykyselyt ('gemzer') ja moni-ikkunainen jakokiinnitys ('split right with <n>').",
        "Tuottavuussovellukset: Ylläpidetty omat puhekieliopit LibreOffice Calcille, VS Coden Git-työnkuluille ja salaisuuksien sumennustyökaluille."
      ],
      "infrastructure": [
        "Laitteiston IPC-silta: Kehitetty kevyt XML-RPC HTTP -palvelin (caster_toggle_mic_key.py) porttiin 8341 yhdistettynä foot_pedal.ahk -skriptiin välittömään mikrofonin kytkentään ja oikean painikkeen sointuklikkaukseen (F13 pohjassa + F15 painettu).",
        "Sovellusvaihtimen ydin (app_switcher.py): Suunniteltu modulaarinen WindowsOSAdapter virtuaalityöpöytäeristyksellä (pyvda), 3-portaisella vikasietokohdistuksella, Win32 AttachThreadInput -ohituksella ja valenäppäimen (0xFF / VK_NONE) valikkolukituksen estolla sekä Caster HUD -tulostinintegraatiolla.",
        "CI/CD ja koodin laatu: Otettu käyttöön automatisoidut GitHub Actions -työnkulut (ci.yml, release.yml, link-check.yml) ja pre-commit-koukut valvoen Ruff-linttausta/muotoilua, UTF-8 stdin -dekoodausta ja räätälöityjä vuodonestoskriptejä (check_absolute_paths.py, check_command_uniqueness.py)."
      ],
      "docs_and_research": [
        "Wayfinder UIA -säietutkimuskokoelma (docs/wayfinder-uia-threading/): Valmisteltu 38 tutkimustikettiä analysoiden COM-huonesäikeistystä, C# FlaUI -toteutusmalleja, Model Context Protocol (MCP) -palvelimia ja avustavia työkaluja (NVDA, Terminator, UFO, hunt-and-peck).",
        "Puhemoottorin sisäosat: Dokumentoitu Kaldi-suoratoistomoottorin staattinen anatomia, FST-kääntäjän kilpatilanteet ja Dragonfly-sääntöjen aktivointielinkaaren tulostusjäljitys.",
        "LexiconCode PR #881 -syväanalyysi: Luetteloitu dynaamisen DictList-ikkunavaihdon rajoitteet mukaan lukien Kaldin dynaamisen graafin kääntämisesteet, Explorerin uudelleenkäynnistyksestä palautuminen ja sanaston saastuminen.",
        "Repositorion aivojen hierarkia: Vakiinnutettu docs/context/repository-brain.md yhtenäiseksi totuuden lähteeksi jakaen dokumentaation arkkitehtuuriin, ominaisuuksiin, kehyselityksiin, vianmääritykseen ja historiaan."
      ]
    },
    "technical_lessons": [
      "Empiirinen profilointi vs. teoreettiset oletukset: Viikkojen teoreettinen huoli COM STA/MTA -säielukkiutumisista kumoutui, kun empiirinen telemetria todisti, että konsolin tulostusjäätymiset johtuivat Windows PowerShellin QuickEdit-tilasta, joka pysäytti suorituksen tekstin tullessa valituksi.",
      "Kaldi Finite State Transducer (FST) -suoritusaikaiset invariantit: Vaikka Python-puolen Dragonfly-kieliopit voivat päivittää sanalistoja (DictList) dynaamisesti ajon aikana, Kaldin taustalla olevaa dekoodausgraafia ei voi kääntää lennosta ilman täyttä moottorin uudelleenkäynnistystä, mikä tekee puhtaasta dynaamisesta sanaston löytämisestä yhteensopimatonta kesken istunnon tapahtuvan tunnistuksen kanssa.",
      "Windows COM -huoneiden säieturvallisuus: Standardeja taustatyösäiealtaita ei voi naiivisti soveltaa Windows UI Automationiin; Single-Threaded Apartment (STA) -huoneisiin sidotut COM-objektit epäonnistuvat tai lukkiutuvat kutsuttaessa säikeiden yli ilman tiukkoja marshaling-mekanismeja.",
      "Win32 Foreground Lock -rajoitusten lieventäminen: Käyttöjärjestelmän etualarajoitusten (SetForegroundWindow) kiertäminen vaatii huolellisesti jaksotetun putken, jossa yhdistyvät AttachThreadInput, simuloitu valenäppäinpainallus (VK_NONE) valikkopalkin lukittumisen estämiseksi, UIA-tehtäväpalkkiklikkaukset ja Win+T-näppäimistövarajärjestelmät.",
      "Sanaston ja akustiikan saastuminen: Dynaamisten ikkunaotsikoiden ja selainvälilehtien hallitsematon syöttö lisää satunnaisia heksatiivisteitä ja roskamerkkejä Kaldin G2P-sanakirjaan (g2p-en), pidentäen käännösaikoja, heikentäen akustisen mallin tarkkuutta ja moninkertaistaen samankuuloisten sanojen törmäyksiä."
    ],
    "journey_quotes": [
      "Lopetin words-tiedoston käytön, koska en saanut muuntimia toimimaan, joten luotan nyt vain niiden muokkaamiseen Casterin lähdekoodissa (5aa6718)",
      "Tämä uusi lähestymistapa on vielä arvioitavana. Vaikka sitä ei pidetä vielä 100 % täydellisenä, varhainen rajallinen käyttö osoittaa parantunutta luotettavuutta ja vähemmän kohdistusvirheitä (b03e52c)",
      "Sovellusvaihtimen suorituskyvyn empiirinen testaus tunnisti Windows PowerShell QuickEdit -tilan stdout-jäätymisten perussyyksi, jotka oli aiemmin laitettu COM-lukkiutumisten syyksi (ca5dc70)",
      "Kolmannen osapuolen MCP-palvelimien testaus osoitti, että yleiset LLM-agenttiratkaisut tuovat tarpeetonta raskautta ja riippuvuuksia, mikä vaati kääntymistä räätälöidyn C# Micro MCP -palvelimen suunnitteluun (bc983b7)",
      "Auttaa vähentämään kognitiivista kuormitusta luomalla selkeän muutoshistorian ja tiekartan kehitysympäristölle (463140d)",
      "Repositorion pääasiakirja oli täynnä pitkiä muistiinpanoja päättyneistä tutkimussessioista, mikä vaikeutti nykyisen kehitysfokuksen seuraamista... Wayfinder kehystettiin täsmällisesti strukturoiduksi tekoälytutkimukseksi ydintoiminnon sijaan (d3e90fd, 763e272)",
      "Tämä tehtiin, koska minun piti puhua sen sijaan Calc-makroistani. Jätetty tyhjäksi to-do-merkinnäksi toistaiseksi (6dc6d34)"
    ]
  }
];
