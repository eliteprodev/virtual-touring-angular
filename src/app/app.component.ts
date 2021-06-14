import { Component } from '@angular/core';
declare var pannellum: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  public pics: any;
  public counter: number = 0;
  public showPrev!: boolean;
  public showNext!: boolean;
  public indexPic: number = 0

  constructor() {
    this.pics = [
      { name: "satellite", img: "https://pannellum.org/images/alma.jpg" },
      { name: "street", img: "https://pannellum.org/images/charles-street.jpg" },
      { name: "correlator", img: "https://pannellum.org/images/alma-correlator-facility.jpg" },
    ]
  }

  ngOnInit() {

    if (this.pics.length > 1) {
      this.showPrev = true;
      this.showNext = true;
    }
    this.set360Image(0);
  }

  slidePrev(): void {
    if(this.indexPic !== 0){
      this.indexPic -= 1;
      this.set360Image(this.indexPic)
    }
  }

  slideNext(): void {
    if(this.indexPic+1 < this.pics.length) {
      this.indexPic += 1;
      this.set360Image(this.indexPic)
    }
  }

  set360Image(i:number): void {
    this.indexPic = i;
    pannellum.viewer(document.getElementById('panaroma'), {
      "title":  this.pics[i].name,
      "type": "equirectangular",
      "panorama": this.pics[i].img,
      "autoLoad": true
    });
  }
 
}
