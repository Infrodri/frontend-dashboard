

import Image from 'next/image';
import { fetchFilteredInvoices } from '../helpers/api';
import { InvoiceTable } from 'anjrot-components';
import { FC } from 'react';
import { deleteInvoice } from '../helpers/actions';


interface InvoicesWrapperProps {
    query?: string;
    page?: number;
    

}

const InvoiceWrapper: FC<InvoicesWrapperProps> = async ({query, page})  => {
    console.log("query :>>",query);
    const getInvoices = await fetchFilteredInvoices(query || "", page  );
    return  (
        <InvoiceTable 
    invoices={getInvoices} 
    ImgComponent={Image} 
    className='bg-slate-700' 
    tableHeader={{className: "text-white"}} 
    deleteAction={deleteInvoice}
    />
    );
};

export default InvoiceWrapper;