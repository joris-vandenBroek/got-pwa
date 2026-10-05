/**
 * Updates the seasons array in world.json with extended descriptions
 */
const fs = require('fs');
const world = JSON.parse(fs.readFileSync('data/world.json', 'utf8'));

world.seasons = [
  {
    "number": 1,
    "year": 2011,
    "episodes": 10,
    "spoiler_level": "laag",
    "summary": "Westeros wordt geïntroduceerd via het perspectief van de familie Stark. Ned Stark, Lord van Winterfell, wordt door zijn oude vriend koning Robert Baratheon gevraagd om Hand des Konings te worden nadat de vorige Hand, Jon Arryn, plotseling stierf. In King's Landing ontdekt Ned dat Arryn vermoord werd omdat hij een verontrustend geheim op het spoor was gekomen: de drie 'kinderen' van koningin Cersei zijn in werkelijkheid niet van Robert, maar de vrucht van een geheime relatie tussen Cersei en haar eigen broer Jaime Lannister. Bran Stark, de jonge zoon van Ned, betrapt Cersei en Jaime in het geheim — waarop Jaime hem zonder aarzeling van een hoge toren duwt om hem het zwijgen op te leggen. Bran overleeft maar raakt verlamd. Tegelijkertijd trouwt Daenerys Targaryen op aandringen van haar brute broer Viserys met de Dothraki-krijgsleider Khal Drogo en past ze zich aan in de steppecultuur. Arya begint zwaardlessen. Jon Snow sluit zich aan bij de Nachtwacht aan The Wall. Ned Stark confronteert Cersei met zijn kennis van het geheim maar wordt al snel gearresteerd op bevel van de jonge, wreedaardige Joffrey die na de dood van Robert (een verdacht jachtongeval) de troon bestijgt. Hoewel Ned schuld bekent in ruil voor gratie, laat Joffrey hem toch onthoofden — een schok voor iedereen die verwacht dat de hoofdpersoon het seizoen overleeft. Robb Stark roept zijn legers en trekt naar het zuiden voor wraak. In Essos sterft Khal Drogo door een magische infectie, maar Daenerys loopt ongedeerd door een begrafenisvuur en staat er de volgende ochtend op met drie pas uitgebroede draken — voor het eerst in eeuwen."
  },
  {
    "number": 2,
    "year": 2012,
    "episodes": 10,
    "spoiler_level": "middel",
    "summary": "De dood van Robert Baratheon ontketent de 'Oorlog der Vijf Koningen': Joffrey Lannister (de zittende koning), Stannis Baratheon (rechtmatige erfgenaam), Renly Baratheon (zijn populaire jongere broer), Robb Stark (Koning in het Noorden) en later Balon Greyjoy (Koning der Ijzeren Eilanden) claimen allemaal de troon. Renly, de grote favoriet, wordt vermoord door een mysterieuze schaduwfiguur die Melisandre, de rode priesteres van Stannis, baart. Theon Greyjoy, jarenlang gijzelaar en 'vertrouweling' van de Starks, verraadt Robb en neemt Winterfell in een verrassing in. Daenerys doorkruist Essos met haar drie jonge draken op zoek naar schepen en bondgenoten, en belandt in de rijke stad Quarth. Jon Snow trekt voorbij The Wall met een verkenningseenheid van de Nachtwacht en ziet voor het eerst de dreiging die zich in het noorden opbouwt. Tyrion Lannister, door zijn vader Tywin gestuurd als Hands de Konings, keert King's Landing om met zijn politieke brein. Het seizoen culmineert in de Slag van de Blackwater, waarbij Stannis's vloot en leger in een vernietigende aanval op King's Landing stuiten op Tyrions wildfire-val — duizenden schepen gaan in vlammen op en Stannis trekt zich terug. Tyrion raakt gewond en wordt door zijn vader Tywin aan de kant gezet."
  },
  {
    "number": 3,
    "year": 2013,
    "episodes": 10,
    "spoiler_level": "hoog",
    "summary": "Het meest schokkende seizoen, beroemd om de Rode Bruiloft. Daenerys koopt in Astapor een leger van 8.000 Onbezoedelden (getrainde slaven-soldaten), maar vervolgens bedriegt ze de slavenhandelaar: ze laat Drogon de man en zijn lijfwachten verbranden en verklaart de Onbezoedelden vrij — die haar desondanks trouw blijven als bevrijd leger. In Westeros verliest Jaime Lannister zijn rechterhand bij een gevangenname, een ingrijpende les in kwetsbaarheid voor de trots ridder. Robb Stark heeft zijn belofte gebroken door niet te trouwen met een dochter van Lord Walder Frey — in plaats daarvan huwde hij Talisa Maegyr. Op de bruiloft van Robbst' oom Edmure met een Frey-dochter slaan de Freys en de Lannisters toe: Robb, Talisa (die zwanger was) en Catelyn Stark worden allemaal vermoord in wat bekendstaat als de Rode Bruiloft — een van de meest traumatiserende televisiemomenten ooit. Arya is vlak bij haar familie maar arriveert net te laat en ontsnapt met Sandor Clegane. Bran Stark trekt met zijn groepje voorbij The Wall op zoek naar de mystieke Drieoogige Raaf. Jon Snow heeft zich tijdelijk bij de Wildlings aangesloten als spion maar zijn cover begint te verzwakken."
  },
  {
    "number": 4,
    "year": 2014,
    "episodes": 10,
    "spoiler_level": "hoog",
    "summary": "Joffrey Baratheon wordt vergiftigd op zijn eigen huwelijksfeest met Margaery Tyrell, voor de ogen van zijn moeder Cersei en zijn oom Jaime. Tyrion, die net daarvoor ruzie had met Joffrey, wordt beschuldigd van de moord en gevangengezet. Oberyn Martell uit Dorne biedt aan om als kampvechter voor Tyrion op te treden — hij wil wraak op Ser Gregor 'The Mountain' Clegane die zijn zus verkrachtte en vermoordde. In een episch duel verslaat Oberyn aanvankelijk de gigantische Mountain, maar terwijl hij hem dwingt zijn misdaden te bekennen, draait The Mountain de situatie om en vermorzelt Oberyn's hoofd. Tyrion wordt veroordeeld en wacht op executie. Zijn broer Jaime bevrijdt hem, maar Tyrion neemt een omweg: hij confronteert zijn vader Tywin — die ooit zijn lief Shae aan een executie liet onderwerpen — en vermoordde hem met een kruisboog op het toilet. Tyrion vlucht naar Essos. Arya reist met Sandor 'de Hond' Clegane, die haar naar haar tante Lysa Arryn brengt — maar Lysa is net gevallen door Petyr Baelish. Bran bereikt eindelijk de Drieoogige Raaf. Daenerys verovert Meereen. In het Noorden probeert Jon Snow de Wildlings-aanval op Castle Black te weerstaan — duizenden Wildlings bestormen The Wall terwijl de Nachtwacht met maar een handvol mannen verdedigt."
  },
  {
    "number": 5,
    "year": 2015,
    "episodes": 10,
    "spoiler_level": "hoog",
    "summary": "Cersei geeft uit wanhoop en jaloezie de Hoge Spaarder (religieuze fanaticus) toestemming om zijn eigen gewapende politie te hervormen: de Faith Militants. Dit komt haar al snel op haar eigen arrestatie te staan wegens overspel. Ze is gedwongen haar 'Walk of Shame' te doen: naakt door de straten van King's Landing lopen terwijl de menigte haar bespot. Jon Snow wordt gekozen als Lord Commander van de Nachtwacht en sluit een controversieel akkoord met de Wildlings: hij laat hen door The Wall om ze samen te beschermen tegen de White Walkers. Zijn eigen broeders beschouwen dit als verraad. Stannis Baratheon rukt op naar Winterfell in de sneeuw; zijn fanatieke raadgeefster Melisandre overtuigt hem zijn eigen dochter Shireen levend te verbranden als offer — waarna zijn leger desintegreert en hij door Brienne van Tarth wordt gedood. Arya doet haar noviciaat bij de Gezichtsloze Mannen in Braavos en leert gezichten aannemen. Jon Snow keert terug van een missie bij de Wildlings maar wordt in een hinderlaag gelokt: zijn eigen officieren steken hem herhaaldelijk neer en laten hem voor dood achter in de sneeuw."
  },
  {
    "number": 6,
    "year": 2016,
    "episodes": 10,
    "spoiler_level": "hoog",
    "summary": "Melisandre wekt Jon Snow terug tot leven. Bran ziet in visioen de geboorte van Jon Snow in de 'Toren der Vreugde' — en ontdekt dat Jon niet de bastaard van Ned Stark is, maar de geheime zoon van Lyanna Stark en Rhaegar Targaryen (en dus van koninklijk Targaryen-bloed). Hodor sterft heroïsch als hij de deur vasthoudt (hold the door) zodat Bran en Meera kunnen vluchten van de Wights — het hartverscheurende moment verklaart ook zijn hele naam. Jon en Sansa heroveren Winterfell in de Slag van de Bastaard Kinderen: Jon's leger staat op het punt vernietigd te worden als de Riddlers van het Dal, opgeroepen door Sansa via Petyr Baelish, de dag redden. Ramsey Bolton, de sadistische heerser van Winterfell, wordt daarna door Sansa opgevoerd aan zijn eigen hongerige honden. Cersei vermijdt haar rechtszaak door het Septum (de grote kerk) van King's Landing op te blazen met verborgen voorraden wildfire — honderden mensen sterven, inclusief de Hoge Spaarder, Margaery en haar familie. Haar zoon Tommen, overweldigd door verdriet, pleegt zelfmoord. Cersei kroont zichzelf koningin van Westeros. In Essos verovert Daenerys de leiders van de Dothraki-khalasars en verbrandt ze, waarna duizenden Dothraki haar vrijwillig volgen. Arya keert terug naar Westeros en vermoordt Walder Frey — na hem eerst een taart te hebben gevoed gemaakt van zijn eigen zonen."
  },
  {
    "number": 7,
    "year": 2017,
    "episodes": 7,
    "spoiler_level": "hoog",
    "summary": "Daenerys arriveert eindelijk in Westeros en installeert haar basis op Dragonstone — het eilandkasteel van haar geboortegeslacht. Jon Snow reist naar haar toe om steun te vragen in de strijd tegen de White Walkers en om dragonglas te mogen delven. Ze ontmoeten elkaar voor het eerst — twee mensen die er beiden van overtuigd zijn te doen wat goed is, maar met heel andere achtergronden. Daenerys verliest meerdere bondgenoten door Cersei's spel: de vloot van Euron Greyjoy vernietigt de Dornische alliantie en de Greyjoy-vloot van Yara, en Highgarden valt. Jaime voert een aanval uit op de konvooien van Daenerys, maar Daenerys verschijnt met Drogon en de Dothraki en vernietigt de Lannister-legermacht. Om de White Walkers te bewijzen aan Cersei reist Jon voorbij The Wall met een kleine groep om een levende Wight te vangen. De Night King gooit een ijsspeer en doodt een van Daenerys' draken — Viserion — die hij vervolgens als IJsdraak opwekt. Jon en Daenerys worden nader tot elkaar. De ijsdraak Viserion vernietigt op bevel van de Night King een groot deel van The Wall — de barrière van 300 meter hoog die duizend jaar bescherming bood valt."
  },
  {
    "number": 8,
    "year": 2019,
    "episodes": 6,
    "spoiler_level": "maximum",
    "summary": "Het eindseizoen brengt alle verhaalslijnen samen voor de laatste gevechten. De Lange Nacht: het leger van de White Walkers bereikt Winterfell. In een donkere, chaotische veldslag staat het gecombineerde leger van de levenden op het punt te verliezen — totdat Arya Stark, de getrainde moordenares, de Night King van achter benadert en hem doodt met het Valyrische stalen dolk, waarna zijn volledig ijsleger in één klap uiteenvalt. Daenerys, diep verdrietig en voelend dat niemand haar in Westeros echt accepteert als koningin, verliest ook nog haar tweede draak Rhaegal aan Euron Greyjoy's vloot en ziet haar beste vriendin Missandei geëxecuteerd worden door Cersei. Ze besluit King's Landing aan te vallen — maar ook nadat de stad zich overgeeft, blijft ze met Drogon de bevolking, huizen en buurten verbranden. Duizenden onschuldige burgers sterven in de vlammen. Jon Snow, die intussen heeft ontdekt wie hij werkelijk is (de wettige erfgenaam van de IJzeren Troon), confronteert Daenerys met haar acties maar doodt haar uiteindelijk uit noodzaak om verdere slachting te voorkomen. Drogon smelt de IJzeren Troon en vliegt weg met het lichaam van Daenerys. De overlevende heren kiezen Bran Stark als de nieuwe koning van Westeros. Jon Snow wordt verbannen naar het noorden van The Wall — waar hij uiteindelijk met de Wildlings trekt naar de echte vrijheid van het hoge noorden."
  }
];

fs.writeFileSync('data/world.json', JSON.stringify(world, null, 2));
console.log('Seizoenen bijgewerkt in world.json');
world.seasons.forEach(s => console.log(`  S${s.number}: ${s.summary.length} tekens`));
