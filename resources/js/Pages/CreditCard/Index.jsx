import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function CreditCardsIndex(props) {

    const creditCards = props.credit_cards;

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Credit Card</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">

                            <h1>Credit cards</h1>

                            <div className="w-100">

                                <table className="mt-8 table-auto border min-w-full">
                                    <thead>
                                        <tr className="border text-left">
                                            <th className="border p-2">#</th>
                                            <th className="border p-2">Name</th>
                                            <th className="border p-2">Limit</th>
                                            <th className="border p-2">Closing day</th>
                                            <th className="border p-2">Payment day</th>
                                            <th className="border p-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {creditCards.map((creditCard) => (
                                            <tr className="border text-left" key={creditCard.id}>
                                                <td className="border p-2">{creditCard.id}</td>
                                                <td className="border p-2">{creditCard.name}</td>
                                                <td className="border p-2">{Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL'}).format(creditCard.limit)}</td>
                                                <td className="border p-2">{creditCard.closing_day}</td>
                                                <td className="border p-2">{creditCard.payment_day}</td>
                                                <td className="border p-2">
                                                    <a className="mr-2" href={route('credit-cards.transactions.index', creditCard.id)}>Transactions</a>
                                                    <a href={route('credit-cards.edit', creditCard.id)}>Edit</a>
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
