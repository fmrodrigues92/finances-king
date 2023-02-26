import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


export default function CreditCardTransactionsIndex(props) {

    let creditCard = props.creditCard;
    let creditCardsTransactions = props.transactions;

    //get month from url all paramaters
    let urlParams = new URLSearchParams(window.location.search);
    let currentOrSelectedMonth = urlParams.get('month') ?? format(new Date(), 'MM');
    let currentOrSelectedYear = urlParams.get('year') ?? format(new Date(), 'yyyy');


    //all months
    const months = [
        {id: '01', name: 'January'},
        {id: '02', name: 'February'},
        {id: '03', name: 'March'},
        {id: '04', name: 'April'},
        {id: '05', name: 'May'},
        {id: '06', name: 'June'},
        {id: '07', name: 'July'},
        {id: '08', name: 'Agust'},
        {id: '09', name: 'September'},
        {id: '10', name: 'October'},
        {id: '11', name: 'November'},
        {id: '12', name: 'December'},
    ];

    //year from 2015 to 2050 - generata from for
    const years = [];
    for (let i = 2015; i <= 2050; i++) {
        years.push(i);
    }

    //set selected month
    let SetSelectedMonth = (e) => {
        let selectedMonth = e.target.value;
        currentOrSelectedMonth = selectedMonth;
    }

    //set selected year
    let SetSelectedYear = (e) => {
        let selectedYear = e.target.value;
        currentOrSelectedYear = selectedYear;
    }

    //filter function
    let filter = () => {
        // get month and year from select
        let selectedMonth = currentOrSelectedMonth;
        let selectedYear = currentOrSelectedYear;

        //axios for update url with params
        axios.get(route('credit-cards.transactions.index', {creditCard:creditCard.id, month: selectedMonth, year: selectedYear}))
            .then((response) => {
                //update page with new data
                creditCard = response.data.creditCard;
                creditCardsTransactions = response.data.transactions;

                //update url with params
                window.history.pushState({}, '', route('credit-cards.transactions.index', {creditCard:creditCard.id, month: selectedMonth, year: selectedYear}));
            }
        );
    }

    //==================================================================================================
    //==================================================================================================
    //==================================================================================================

    let data = {
        datasets: [
          {
            label: 'Uso do limite',
            data: props.limitUse,
            backgroundColor: '#77CEFF',
          }
        ],
    };

    let options = {
        responsive: true,
        maintainAspectRatio: false,
    };



    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Credit Card Transactions</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">

                            <div className='mb-5 min-h-[300px] max-h-[300px]'>
                                <Line data={data} options={options} />
                            </div>

                            <div className='flex justify-between'>
                                <h1>Credit cards transactions</h1>
                                <h1 className='font-bold float-right'>{Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL'}).format(creditCardsTransactions.reduce((total, creditCardTransaction) => total + creditCardTransaction.amount, 0))}</h1>
                            </div>

                            <div className='mt-4 flex justify-between'>
                                <div>
                                    {/* select month as filter */}
                                    <select id='monthField' name='month' defaultValue={currentOrSelectedMonth} onChange={SetSelectedMonth}>
                                        {months.map((month, i) => (
                                            <option key={i} value={month.id}>{month.name}</option>
                                        ))}
                                    </select>

                                    {/* select year as filter */}
                                    <select id='yearField' name='year' defaultValue={currentOrSelectedYear} onChange={SetSelectedYear} className='ml-2'>
                                        {years.map((year, i) => (
                                            <option key={i} value={year}>{year}</option>
                                        ))}
                                    </select>

                                    {/* button to filter */}
                                    <button className='ml-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-xl' onClick={filter}>Filter</button>
                                </div>
                                <div className='flex'>
                                    <button className='ml-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-xl'>Add transaction</button>
                                </div>
                            </div>

                            <div className="w-100">

                                <table className="mt-8 table-auto border min-w-full">
                                    <thead>
                                        <tr className="border text-left">
                                            <th className="border p-2">#</th>
                                            <th className="border p-2">Description</th>
                                            <th className="border p-2">Amount</th>
                                            <th className="border p-2">Date in</th>
                                            <th className="border p-2">Date out</th>
                                            <th className="border p-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {creditCardsTransactions.map((creditCardTransaction) => (
                                            <tr className="border text-left" key={creditCardTransaction.id}>
                                                <td className="border p-2">{creditCardTransaction.id}</td>
                                                <td className="border p-2">{creditCardTransaction.description}</td>
                                                <td className="border p-2">{Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL'}).format(creditCardTransaction.amount)}</td>
                                                <td className="border p-2">{new Intl.DateTimeFormat('pt-BR', {year: 'numeric',month: '2-digit',day: '2-digit'}).format(new Date(creditCardTransaction.date_in))}</td>
                                                <td className="border p-2">{(creditCardTransaction.date_out != null) ? new Intl.DateTimeFormat('pt-BR', {year: 'numeric',month: '2-digit',day: '2-digit'}).format(new Date(creditCardTransaction.date_out)) : ''}</td>
                                                <td className="border p-2">
                                                    {/* <a href={route('credit-cards-transactions.edit', creditCardTransaction.id)}>Edit</a> */}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
