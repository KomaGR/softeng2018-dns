
interface Price {
    price:number,
    date:Date,
    productTags:string[],
    productName:string,
    productId:string,
    shopTags:string[],
    shopAddress:string,
    shopLng:number,
    shopLat:number,
    shopId:string,
    shopDist:number
}

let sortlist: string[] = ['price', 'price', 'price'];
let asclist: string[] = ['ASC', 'ASC', 'ASC']
let rules:number = 1;
//negative if first is smaller

function priceComparator(a: Price, b: Price): number {
    for (let i = 0; i < sortlist.length; i++) {
        let key = sortlist[i];
        // console.log("--------");
        
        // console.log(`${sortlist[i]} and ${asclist[i]}`);
        
        let asc = (asclist[i] === 'ASC' ? 1 : -1);
        // console.log(`${key} and ${asc}`);
        if (key === 'date') {
            // console.log((new Date(a.date).getTime()) > (new Date(b.date).getTime()));
            // console.log((new Date(a.date).getTime()) < (new Date(b.date).getTime()));
            
            if ((new Date(a.date).getTime()) > (new Date(b.date).getTime())) return asc;
            if ((new Date(a.date).getTime()) < (new Date(b.date).getTime())) return -asc;
        } else if (key === 'geoDist') {
            // console.log(a.shopDist > b.shopDist);
            // console.log(a.shopDist < b.shopDist);
            
            if (a.shopDist > b.shopDist) return asc;
            if (a.shopDist < b.shopDist) return -asc;
        } else {
            if (a.price > b.price) return asc;
            if (a.price < b.price) return -asc;
        }
    }
    return 0;
}

export default function(start:number, count:number, prices: Price[], sort: string | string[]) {
    console.log(sort);
    if (sort) {
        if (!(typeof sort === 'string')) {
            console.log('Multiple rules');
                    
            sortlist = [];
            asclist = [];
            let i = 0
            for (i = 0; i < sort.length; i++) {
                const temp = sort[i].split('|');
                sortlist[i] = temp[0];
                asclist[i] = temp[1];

                // console.log(`${sortlist[i][0]} && ${sortlist[i][1]} &&`);        
            }
        } else {
            console.log('Single rule');
            const temp = sort.split('|');
            sortlist[0] = temp[0];
            asclist[0] = temp[1];
        }
    }
    
    return prices.sort(priceComparator).slice(start, start+count);
}