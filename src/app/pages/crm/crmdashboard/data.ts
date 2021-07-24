/*
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

export { cardData, tableData };


*/


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

