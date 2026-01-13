import { Order } from '../models/Order';
import Link from 'next/link';
import { Stack, Table } from 'react-bootstrap';
import AddressTable from './AddressTable';
type Props = {
  order: Order;
};

const BillingNShippingInfo = ({ order }: Props) => {
  if (!order) return <>No order found</>;
  return (
    <>
      <div className="accordion mb-2" id="accordionAddress">
        <div className="accordion-item">
          <h2 className="accordion-header" id="accordionAddress">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseAddress"
              aria-expanded="true"
              aria-controls="collapseAddress"
            >
              <i className="fa fa-truck me-2" aria-hidden="true"></i>  shipping
            </button>
          </h2>
          <div
            id="collapseAddress"
            className="accordion-collapse collapse show"
            aria-labelledby="accordionAddress"
            data-bs-parent="#accordionAddress"
          >
            <div className="accordion-body">
              <div className="border border-1 shadow-sm p-3 mb-3 bg-body rounded">
                <div className="d-flex flex-row gap-2 rounded">
                  <div className="col-12 ">
                    <AddressTable address={order.shippingAddressVm} isShowOnGoogleMap={false} />
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillingNShippingInfo;
