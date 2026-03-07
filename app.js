
const App={

 state:{
  round:0,
  bankroll:30000,
  p:null,
  b:null
 },

 init(){

  UI.buildKeys('p')
  UI.buildKeys('b')

 },

 input(side,val,btn){

  UI.flash(btn)

  document.getElementById(side+'display').textContent=val

  this.state[side]=val

  if(this.state.p!==null && this.state.b!==null){

     this.commit()

  }

 },

 commit(){

   this.state.round++

   document.getElementById('round').textContent=this.state.round

   let p=Engine.process('player',this.state.p)
   let b=Engine.process('banker',this.state.b)

   document.getElementById('pnext').textContent=p.bets.join(', ')
   document.getElementById('bnext').textContent=b.bets.join(', ')

   let exposure=p.exposure+b.exposure

   document.getElementById('exposure').textContent='₹'+exposure

   document.getElementById('risk').textContent=exposure>2000?'HIGH':exposure>500?'MED':'LOW'

   document.getElementById('tnext').textContent='₹'+exposure

   this.state.p=null
   this.state.b=null

 },

}

window.onload=()=>App.init()
