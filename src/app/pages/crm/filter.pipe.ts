import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  
  

  transform(items: any[], searchText: string): any[] {
      console.log("FILTER LOG");
      console.log("items",items);
      console.log("searchText",searchText);
      
      var itemData = new Array();
      
      if(typeof items != "undefined") {

        items.forEach(element => {
          console.log(element.firstName+' '+element.lastName);   
          itemData.push(element.firstName+' '+element.lastName);
        });

      }   

      console.log("itemData",itemData);   
      if(!items) return [];
      if(!searchText) return items;
  searchText = searchText.toLowerCase();
  return items.filter( it => {
        console.log("it",it);   
        let itVal = it.firstName+' '+it.lastName;
        console.log("itVal",itVal); 
        return itVal.toLowerCase().includes(searchText);
      });

    /*  
    if(!items) return [];
    if(!searchText) return items;
searchText = searchText.toLowerCase();
return items.filter( it => {
      return it.toLowerCase().includes(searchText);
    });
    */
   }
}