declare const rxjs: any;

interface CardMTG
{
    cards: []
}

interface CardItem
{
    name: string
    rarity: string
    set: string
    imageUrl: string
}

interface Card
{
    name: string
    rarity: string
    imageUrl: string
}

function getCards(cardtitle: string)
{
    const {from} = rxjs;
    const {map, switchMap, tap} = rxjs.operators;
    //Doc API https://docs.magicthegathering.io/
    const apiurl = 'https://api.magicthegathering.io/v1/cards?page=1&name=';
    const p = fetch(apiurl + cardtitle).then(res => res.json());
    
    //Finche non faccio la SUBSCRIBE è un OBSERVABLE
    //Quando faccio la SUBSCIBE diventa una PROMISE
    return from(p).pipe(
        switchMap((data: CardMTG) => from(data.cards || [])),
        map((ele: CardItem) => 
        {
            const card: Card = {
                name: ele.name,
                rarity: ele.rarity,
                imageUrl: ele.imageUrl
            };
        return card;
        }),
        //tap((card: Card) => console.log(card))
    )
    //.subscribe((data: CardMTG) => data);
}

function displayCard(card: Card)
{
    const cardTpl = `<div class="col">
    <div class="card shadow-sm">
    <img src="${card.imageUrl}">  
    <div class="card-body">
        <h4>${card.name}</h4>
        <p class="card-text"></p>
        <div class="d-flex justify-content-between align-items-center">
          <div class="btn-group">
            <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
            <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
          </div>
          <small class="text-body-secondary">9 mins</small>
        </div>
      </div>
    </div>
  </div>`;

  const div = document.createElement('div');
  div.setAttribute('class','col-md-3');
  div.innerHTML = cardTpl;
  const cards = document.querySelector('#cards');
  if(cards && card.imageUrl != null)
  {
    cards.appendChild(div);
  }
}
function cleanCards()
{
    const cards = document.querySelector('#cards');
    if(cards)
    {
        cards.innerHTML = "";
    }
}
function searchCards()
{
    const searchEle = document.querySelector('#search');
    const {fromEvent} = rxjs;
    const {map, switchMap, filter} = rxjs.operators;
    if(searchEle)
    {
        fromEvent(searchEle, 'keyup')
            .pipe(
                //Passo parametro ELE alla FUNZIONE 
                //Mappa
                map((ele: any) => ele.target.value),
                //Filtra
                filter((ele: string) => ele.length > 2),
                //Cambio Stream
                switchMap((ele:string) => getCards(ele))
            )
            .subscribe((card: Card) => displayCard(card))
    }
}

function searchButtonClicked()
{
    const search: any = document.querySelector('#search');

    if(search)
    {
        cleanCards();
        getCards(search.value).pipe().subscribe((card : Card) => displayCard(card));
    }
}

//Gestisco l'evento KEYUP
//searchCards();

//getCards('goblin');