const cardData = [
    {
        icon: 'fe-tag',
        tickets: 150,
        title: 'Total Codes',
        text: '',
    },
    {
        icon: 'fe-tag',
        tickets: 80,
        title: 'Used Codes',
        text: 'warning'
    },
    {
        icon: 'fe-tag',
        tickets: 40,
        title: 'Unused Codes',
        text: 'success'
    },
    {
        icon: 'fe-tag',
        tickets: 20,
        title: 'Expired Codes',
        text: 'danger'
    }
];

const tableData = [
    {
        id: '#1020',
        requestuser: 'assets/images/users/user-9.jpg',
        name: 'Erwin E. Brown',
        subject: 'A new rating has been received',
        assignuser: 'assets/images/users/user-1.jpg',
        priority: 'Medium',
        fname: 'Erwin',
        lname: 'Brown',
        birthdate: '1983/08/11',
        email: 'erwin@rmail.com',
        zipcode: '12345',
        status: 'Used',
        createddate: '2020/04/30',
        duedate: '2020/08/07',

    },
    {
        id: '#1254',
        requestuser: 'assets/images/users/user-8.jpg',
        name: 'Margeret V. Ligon',
        subject: 'Your application has been received!',
        assignuser: 'assets/images/users/user-10.jpg',
        priority: 'High',
        fname: 'Erwin',
        lname: 'Brown',
        birthdate: '1983/08/11',
        email: 'erwin@rmail.com',
        zipcode: '12345',
        status: 'New',
        createddate: '2020/04/30',
        duedate: '2020/08/07',
    },
    {
        id: '#1256',
        requestuser: 'assets/images/users/user-2.jpg',
        name: 'George A. Lianes',
        subject: 'Support for theme',
        assignuser: 'assets/images/users/user-10.jpg',
        priority: 'Low',
        fname: 'Erwin',
        lname: 'Brown',
        birthdate: '1983/08/11',
        email: 'erwin@rmail.com',
        zipcode: '12345',
        status: 'Expired',
        createddate: '2020/04/30',
        duedate: '2020/08/07',
    },
    {
        id: '#1352',
        requestuser: 'assets/images/users/user-5.jpg',
        name: 'Karen R. Doyle',
        subject: 'Question regarding your Bootstrap Theme',
        assignuser: 'assets/images/users/user-8.jpg',
        priority: 'High',
        fname: 'Erwin',
        lname: 'Brown',
        birthdate: '1983/08/11',
        email: 'erwin@rmail.com',
        zipcode: '12345',
        status: 'Expired',
        createddate: '2020/04/30',
        duedate: '2020/08/07',
    },
    {
        id: '#2251',
        requestuser: 'assets/images/users/user-8.jpg',
        name: 'Mark C. Diaz',
        subject: 'Verify your new email address!',
        assignuser: 'assets/images/users/user-10.jpg',
        priority: 'High',
        fname: 'Erwin',
        lname: 'Brown',
        birthdate: '1983/08/11',
        email: 'erwin@rmail.com',
        zipcode: '12345',
        status: 'Expired',
        createddate: '2020/04/30',
        duedate: '2020/08/07',
    },
    {
        id: '#2542',
        requestuser: 'assets/images/users/user-3.jpg',
        name: 'Jose D. Delacruz',
        subject: 'New submission on your website',
        assignuser: 'assets/images/users/user-9.jpg',
        priority: 'Medium',
        fname: 'Erwin',
        lname: 'Brown',
        birthdate: '1983/08/11',
        email: 'erwin@rmail.com',
        zipcode: '12345',
        status: 'Expired',
        createddate: '2020/04/30',
        duedate: '2020/08/07',
    },
    {
        id: '#320',
        requestuser: 'assets/images/users/user-5.jpg',
        name: 'Phyllis K. Maciel',
        subject: 'Verify your new email address!',
        assignuser: 'assets/images/users/user-10.jpg',
        priority: 'High',
        fname: 'Erwin',
        lname: 'Brown',
        birthdate: '1983/08/11',
        email: 'erwin@rmail.com',
        zipcode: '12345',
        status: 'Expired',
        createddate: '2020/04/30',
        duedate: '2020/08/07',
    },
    {
        id: '#3562',
        requestuser: 'assets/images/users/user-8.jpg',
        name: 'Freddie J. Plourde',
        subject: 'Security alert for my account',
        assignuser: 'assets/images/users/user-2.jpg',
        priority: 'Low',
        fname: 'Erwin',
        lname: 'Brown',
        birthdate: '1983/08/11',
        email: 'erwin@rmail.com',
        zipcode: '12345',
        status: 'Expired',
        createddate: '2020/04/30',
        duedate: '2020/08/07',
    },
    {
        id: '#3653',
        requestuser: 'assets/images/users/user-3.jpg',
        name: 'Jessica T. Phillips',
        subject: 'Item Support Message sent',
        assignuser: 'assets/images/users/user-10.jpg',
        priority: 'Medium',
        fname: 'Erwin',
        lname: 'Brown',
        birthdate: '1983/08/11',
        email: 'erwin@rmail.com',
        zipcode: '12345',
        status: 'Expired',
        createddate: '2020/04/30',
        duedate: '2020/08/07',
    },
    {
        id: '#3653',
        requestuser: 'assets/images/users/user-4.jpg',
        name: 'Luke J. Sain',
        subject: 'Your password has been resett',
        assignuser: 'assets/images/users/user-10.jpg',
        priority: 'Low',
        fname: 'Erwin',
        lname: 'Brown',
        birthdate: '1983/08/11',
        email: 'erwin@rmail.com',
        zipcode: '12345',
        status: 'Expired',
        createddate: '2020/04/30',
        duedate: '2020/08/07',
    },
    {
        id: '#3654',
        requestuser: 'assets/images/users/user-2.jpg',
        name: 'Robert K. Joseph',
        subject: 'Support for theme',
        assignuser: 'assets/images/users/user-10.jpg',
        priority: 'Low',
        fname: 'Erwin',
        lname: 'Brown',
        birthdate: '1983/08/11',
        email: 'erwin@rmail.com',
        zipcode: '12345',
        status: 'Expired',
        createddate: '2020/04/30',
        duedate: '2020/08/07',
    },
    {
        id: '#3658',
        requestuser: 'assets/images/users/user-9.jpg',
        name: 'Darrell J. Cook',
        subject: 'Christopher S. Ahmad',
        assignuser: 'assets/images/users/user-10.jpg',
        priority: 'Medium',
        fname: 'Erwin',
        lname: 'Brown',
        birthdate: '1983/08/11',
        email: 'erwin@rmail.com',
        zipcode: '12345',
        status: 'Expired',
        createddate: '2020/04/30',
        duedate: '2020/08/07',
    },
    {
        id: '#854',
        requestuser: 'assets/images/users/user-2.jpg',
        name: 'William L. Trent',
        subject: 'Your Profile has been accepted',
        assignuser: 'assets/images/users/user-10.jpg',
        priority: 'High',
        fname: 'Erwin',
        lname: 'Brown',
        birthdate: '1983/08/11',
        email: 'erwin@rmail.com',
        zipcode: '12345',
        status: 'Expired',
        createddate: '2020/04/30',
        duedate: '2020/08/07',
    },
    {
        id: '#9501',
        requestuser: 'assets/images/users/user-10.jpg',
        name: 'Amy R. Barnaby',
        subject: 'Homeworth for your property increased',
        assignuser: 'assets/images/users/user-3.jpg',
        priority: 'Low',
        fname: 'Erwin',
        lname: 'Brown',
        birthdate: '1983/08/11',
        email: 'erwin@rmail.com',
        zipcode: '12345',
        status: 'Expired',
        createddate: '2020/04/30',
        duedate: '2020/08/07',
    },
    {
        id: '#9852',
        requestuser: 'assets/images/users/user-5.jpg',
        name: 'Debra J. Wilson',
        subject: 'Your item has been updated!',
        assignuser: 'assets/images/users/user-10.jpg',
        priority: 'High',
        fname: 'Erwin',
        lname: 'Brown',
        birthdate: '1983/08/11',
        email: 'erwin@rmail.com',
        zipcode: '12345',
        status: 'Expired',
        createddate: '2020/04/30',
        duedate: '2020/08/07',
    }
];

const projectData = [
    {
        id: 1,
        name: 'App design and development',
        startdate: '01/01/2015',
        duedate: '10/15/2018',
        status: 'Work in Progress',
        client: 'Halette Boivin'
    },
    {
        id: 2,
        name: '	Coffee detail page - Main Page',
        startdate: '21/07/2016',
        duedate: '12/05/2018',
        status: 'Pending',
        client: 'Durandana Jolicoeur'
    },
    {
        id: 3,
        name: 'Poster illustation design',
        startdate: '18/03/2018',
        duedate: '28/09/2018',
        status: 'Done',
        client: 'Lucas Sabourin'
    },
    {
        id: 4,
        name: 'Drinking bottle graphics',
        startdate: '02/10/2017',
        duedate: '07/05/2018',
        status: 'Work in Progress',
        client: 'Donatien Brunelle'
    },
    {
        id: 5,
        name: 'Landing page design - Home',
        startdate: '17/01/2017',
        duedate: '25/05/2021',
        status: 'Coming soon',
        client: 'Karel Auberjo'
    },
];


const inboxDataSingle = [
    {
        image: 'assets/images/users/sh360-noprofile.png',
        id: '8226e7bc-41a1-42b1-9f54-120d754e1bb3',
        name: 'Darlene Robertson',
        time: 'Dec 07',
        message: 'Hey! there I\'m available...'
    }
];

const inboxData = [
    {
        image: 'assets/images/users/sh360-noprofile.png',
        id: '8226e7bc-41a1-42b1-9f54-120d754e1bb3',
        name: 'Darlene Robertson 1',
        time: 'Dec 07',
        message: 'Hey! there I\'m available...'
    },
    {
        image: 'assets/images/users/sh360-noprofile.png',
        id: '8226e7bc-41a1-42b1-9f54-120d754e1bb3',
        name: 'Darlene Robertson 11',
        time: 'Dec 07',
        message: 'Hey! there I\'m available...'
    },
    {
        image: 'assets/images/users/sh360-noprofile.png',
        id: '8226e7bc-41a1-42b1-9f54-120d754e1bb3',
        name: 'Darlene Robertson 2',
        time: 'Dec 07',
        message: 'Hey! there I\'m available...'
    },
    {
        image: 'assets/images/users/sh360-noprofile.png',
        id: '8226e7bc-41a1-42b1-9f54-120d754e1bb3',
        name: 'Darlene Robertson 22',
        time: 'Dec 07',
        message: 'Hey! there I\'m available...'
    },
    {
        image: 'assets/images/users/sh360-noprofile.png',
        id: '8226e7bc-41a1-42b1-9f54-120d754e1bb3',
        name: 'Darlene Robertson 3',
        time: 'Dec 07',
        message: 'Hey! there I\'m available...'
    },
    {
        image: 'assets/images/users/sh360-noprofile.png',
        id: '8226e7bc-41a1-42b1-9f54-120d754e1bb3',
        name: 'Darlene Robertson 33',
        time: 'Dec 07',
        message: 'Hey! there I\'m available...'
    },
    {
        image: 'assets/images/users/sh360-noprofile.png',
        id: '8226e7bc-41a1-42b1-9f54-120d754e1bb3',
        name: 'Darlene Robertson 4',
        time: 'Dec 07',
        message: 'Hey! there I\'m available...'
    },
    {
        image: 'assets/images/users/sh360-noprofile.png',
        id: '8226e7bc-41a1-42b1-9f54-120d754e1bb3',
        name: 'Darlene Robertson 44',
        time: 'Dec 07',
        message: 'Hey! there I\'m available...'
    },
    {
        image: 'assets/images/users/sh360-noprofile.png',
        id: '8226e7bc-41a1-42b1-9f54-120d754e1bb3',
        name: 'Darlene Robertson 5',
        time: 'Dec 07',
        message: 'Hey! there I\'m available...'
    },
    {
        image: 'assets/images/users/sh360-noprofile.png',
        id: '8226e7bc-41a1-42b1-9f54-120d754e1bb3',
        name: 'Darlene Robertson 55',
        time: 'Dec 07',
        message: 'Hey! there I\'m available...'
    },
    {
        image: 'assets/images/users/sh360-noprofile.png',
        id: '8226e7bc-41a1-42b1-9f54-120d754e1bb3',
        name: 'Darlene Robertson 6',
        time: 'Dec 07',
        message: 'Hey! there I\'m available...'
    },
    {
        image: 'assets/images/users/sh360-noprofile.png',
        id: '8226e7bc-41a1-42b1-9f54-120d754e1bb3',
        name: 'Darlene Robertson 66',
        time: 'Dec 07',
        message: 'Hey! there I\'m available...'
    },
    {
        image: 'assets/images/users/sh360-noprofile.png',
        id: '8226e7bc-41a1-42b1-9f54-120d754e1bb3',
        name: 'Darlene Robertson 7',
        time: 'Dec 07',
        message: 'Hey! there I\'m available...'
    },
    {
        image: 'assets/images/users/sh360-noprofile.png',
        id: '8226e7bc-41a1-42b1-9f54-120d754e1bb3',
        name: 'Darlene Robertson 77',
        time: 'Dec 07',
        message: 'Hey! there I\'m available...'
    },
    {
        image: 'assets/images/users/sh360-noprofile.png',
        id: '8226e7bc-41a1-42b1-9f54-120d754e1bb3',
        name: 'Darlene Robertson 8',
        time: 'Dec 07',
        message: 'Hey! there I\'m available...'
    },
    {
        image: 'assets/images/users/sh360-noprofile.png',
        id: '8226e7bc-41a1-42b1-9f54-120d754e1bb3',
        name: 'Darlene Robertson L',
        time: 'Dec 07',
        message: 'Hey! there I\'m available...'
    }
];


export { cardData, tableData, projectData, inboxData, inboxDataSingle };

/*

const inboxData = [
    {
        image: 'assets/images/users/user-1.jpg',
        name: 'Chadengle',
        time: 'Dec 07',
        message: 'Hey! there I\'m available...'
    },
    {
        image: 'assets/images/users/user-2.jpg',
        name: 'Tomaslau',
        time: 'Dec 06',
        message: 'I\'ve finished it! See you so...'
    },
    {
        image: 'assets/images/users/user-3.jpg',
        name: 'Stillnotdavid',
        time: 'Dec 05',
        message: 'This theme is awesome!'
    },
    {
        image: 'assets/images/users/user-4.jpg',
        name: 'Kurafire',
        time: 'Nov 25',
        message: 'Nice to meet you'
    },
    {
        image: 'assets/images/users/user-5.jpg',
        name: 'Shahedk',
        time: 'Nov 15',
        message: 'Hey! there I\'m available...'
    },
    {
        image: 'assets/images/users/user-6.jpg',
        name: 'Adhamdannaway',
        time: 'Nov 10',
        message: 'This theme is awesome!'
    },
    {
        image: 'assets/images/users/user-8.jpg',
        name: 'Arashasghari',
        time: 'Nov 07',
        message: 'Hey! there I\'m available...'
    },
    {
        image: 'assets/images/users/user-9.jpg',
        name: 'Joshaustin',
        time: 'Nov 05',
        message: 'I\'ve finished it! See you so...'
    }
];
*/


/*
import { ChartType } from './dashboard.model';

const widgetsData = [
    {
        icon: 'fe-layers',
        color: 'blue',
        value: 120,
        title: 'Active Deals',
    },
    {
        icon: 'fe-award',
        color: 'success',
        value: 741,
        title: 'Won Deals',
    },
    {
        icon: 'fe-delete',
        color: 'danger',
        value: 256,
        title: 'Lost Deals',
    },
];

const analyticsLineChart: ChartType = {
    chart: {
        height: 330,
        type: 'line',
        zoom: {
            enabled: false
        },
        toolbar: {
            show: false
        }
    },
    labels: ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017'],
    colors: ['#1abc9c', '#f1556c'],
    dataLabels: {
        enabled: false,
    },
    stroke: {
        curve: 'straight',
        width: 2
    },
    series: [{
        name: 'Won Deal',
        data: [50, 75, 30, 50, 75, 50, 75, 100]
    },
    {
        name: 'Lost Deal',
        data: [0, 50, 80, 50, 10, 40, 50, 70]
    }],
    grid: {
        row: {
            colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.2
        },
        borderColor: '#f1f3fa'
    },
    legend: {
        show: false
    },
    responsive: [{
        breakpoint: 600,
        options: {
            chart: {
                toolbar: {
                    show: false
                }
            },
            legend: {
                show: false
            },
        }
    }]
};

const averagetimeBarChart: ChartType = {
    chart: {
        height: 330,
        type: 'bar',
        toolbar: {
            show: false
        }
    },
    plotOptions: {
        bar: {
            columnWidth: '51%',
        },
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
    },
    colors: ['#02c0ce', '#0acf97'],
    series: [{
        name: 'Won Deal',
        data: [100, 75, 50, 75, 50, 75, 100]
    },
    {
        name: 'Lost Deal',
        data: [90, 65, 40, 65, 40, 65, 90]
    }],
    xaxis: {
        categories: ['2012', '2013', '2014', '2015', '2016', '2017', '2018'],
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false
        }
    },
    legend: {
        show: false,
    },
    fill: {
        opacity: 1
    },
    grid: {
        row: {
            colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.1
        },
        borderColor: '#f1f3fa'
    }
};
 

const contactsData = [
    {
        image: 'assets/images/users/user-4.jpg',
        name: 'Paul J. Friend',
        phone: '937-330-1634',
        email: 'pauljfrnd@jourrapide.com',
        location: 'Vine Corporation',
        date: '07/07/2018'
    },
    {
        image: 'assets/images/users/user-3.jpg',
        name: ' Bryan J. Luellen',
        phone: '215-302-3376',
        email: 'bryuellen@dayrep.com',
        location: 'Blue Motors',
        date: '09/12/2018'
    },
    {
        image: 'assets/images/users/user-3.jpg',
        name: 'Kathryn S. Collier',
        phone: '828-216-2190',
        email: 'collier@jourrapide.com',
        location: 'Arcanetworks',
        date: '06/30/2018'
    },
    {
        image: 'assets/images/users/user-1.jpg',
        name: 'Timothy Kauper',
        phone: '(216) 75 612 706',
        email: 'thykauper@rhyta.com',
        location: 'Boar Records',
        date: '09/08/2018'
    },
    {
        image: 'assets/images/users/user-5.jpg',
        name: 'Zara Raws',
        phone: '(02) 75 150 655',
        email: 'austin@dayrep.com',
        location: 'Bearings',
        date: '07/15/2018'
    }
];

const salesDonutChart: ChartType = {
    type: 'donut',
    height: 330,
    series: [30, 12, 20],
    labels: ['Group 2', 'Group 1', 'Group 3'],
    colors: ['#4fc6e1', '#6658dd', '#ebeff2'],
    dataLabels: {
        enabled: false
    },
    legend: {
        show: false
    }
};

export { widgetsData, analyticsLineChart, averagetimeBarChart, contactsData, salesDonutChart };

*/