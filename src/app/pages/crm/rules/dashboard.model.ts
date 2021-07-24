// Card Data
export interface CardData {
    icon: string;
    tickets: number;
    title: string;
    text: string;
}

// Table Data
export interface TableData {
    id: string;
    requestuser: string;
    name: string;
    subject: string;
    assignuser: string;
    priority: string;
    status: string;
    createddate: string;
    duedate: string;
}

// Search Data
export interface SearchResult {
    tickets: TableData[];
    total: number;
}


/*
// Widget Data
export interface Widgets {
    icon: string;
    color: string;
    value: number;
    title: string;
}

// Recent Contacts table data
export interface Contacts {
    image: string;
    name: string;
    phone: string;
    email: string;
    location: string;
    date: string;
}

// Chart data
export interface ChartType {
    data?: any;
    chart?: any;
    series?: any;
    stroke?: any;
    fill?: any;
    labels?: any;
    option?: any;
    type?: any;
    height?: any;
    piechartcolor?: any;
    dataLabels?: any;
    legend?: any;
    color?: any;
    colors?: any;
    toolbar?: any;
    sparkline?: any;
    stacked?: any;
    tooltip?: any;
    xaxis?: any;
    plotOptions?: any;
    grid?: any;
    responsive?: any;
}
*/