import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { Stack, Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import moment from 'moment';
import { useForm, SubmitHandler } from 'react-hook-form';
import queryString from 'query-string';
import { getOrders } from 'modules/order/services/OrderService';
import { OrderSearchForm } from 'modules/order/models/OrderSearchForm';
import { DEFAULT_PAGE_SIZE } from '@constants/Common';
import { Order } from 'modules/order/models/Order';
import OrderSearch from 'modules/order/components/OrderSearch';
import { formatPriceUSD } from 'utils/formatPrice';
import Link from 'next/link';

const Orders: NextPage = () => {
  const { register, watch, handleSubmit } = useForm<OrderSearchForm>();
  const [isLoading, setLoading] = useState(false);

  const [orderList, setOrderList] = useState<Order[]>([]);
  const [pageNo, setPageNo] = useState<number>(0);
  const [isDelete, setDelete] = useState<boolean>(false);
  const orderPageSize = DEFAULT_PAGE_SIZE;

  const watchAllFields = watch(); // when pass nothing as argument, you are watching everything

  const handleGetOrders = () => {
    const params = queryString.stringify({
      ...watchAllFields,
      pageNo: pageNo,
      pageSize: orderPageSize,
    });

    getOrders(params)
      .then((res) => {
        setOrderList(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setLoading(true);
    handleGetOrders();
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo, isDelete]);

  useEffect(() => {
    setLoading(true);
    handleGetOrders();
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmitSearch: SubmitHandler<OrderSearchForm> = async (data) => {
    handleGetOrders();
    setPageNo(0);
  };
  const handlePageChange = ({ selected }: any) => {
    setPageNo(selected);
  };
  if (isLoading) return <p>Loading...</p>;
  return (
    <>
      <div className="row mt-3">
        <div className="col-md-6">
          <h2 className="text-danger font-weight-bold mb-3">Order Management</h2>
        </div>

      </div>
      {/* Filter */}

      <div className="accordion" id="accordionExample">
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingOne">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
              Search
            </button>
          </h2>
          <div
            id="collapseOne"
            className="accordion-collapse collapse show"
            aria-labelledby="headingOne"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              <form onSubmit={(event) => void handleSubmit(onSubmitSearch)(event)}>
                <OrderSearch register={register} />
              </form>
            </div>
          </div>
        </div>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th className="d-flex justify-content-center">
              <input className="form-check-input" type="checkbox" value="" id="checkAll" />
            </th>
            <th>Order Id</th>
            <th>Order status</th>
            <th>Payment status</th>
            <th>Phone</th>
            <th>Created on</th>
            <th>Order Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(orderList) &&
            orderList.map((order) => (
              <tr key={order.id}>
                <td className="d-flex justify-content-center">
                  <input
                    className="form-check-input mb-3"
                    type="checkbox"
                    value=""
                    id={`selectOrder${order.id}`}
                  />
                </td>
                <td>{order.id}</td>
                <td>
                  <span
                    className={
                      order.orderStatus == `COMPLETED`
                        ? `border border-success btn-sm text-success`
                        : order.orderStatus == `PENDING`
                        ? `border border-warning btn-sm text-warning`
                        : `border border-info btn-sm text-info`
                    }
                  >
                    {order.orderStatus}
                  </span>
                </td>
                <td>
                  <div
                    className={
                      order.paymentStatus &&
                      (order.paymentStatus == `COMPLETED`
                        ? `border border-success btn-sm text-success`
                        : order.paymentStatus == `PENDING`
                        ? `border border-warning btn-sm text-warning`
                        : `border border-info btn-sm text-info`)
                    }
                  >
                    {order.paymentStatus}
                  </div>
                </td>

                <td>{order.shippingAddressVm.phone}</td>
                <td>{moment(order.createdOn).format('MMMM Do YYYY, h:mm:ss a')}</td>
                <td>{formatPriceUSD(order.totalPrice)}</td>
                <td style={{ width: '10%' }}>
                  <Stack direction="horizontal" gap={3}>
                    <Link href={`/sales/orders/${order.id}/edit`}>
                      <button className="btn btn-outline-primary btn-sm" type="button">
                        <i className="fa fa-eye me-2" aria-hidden="true"></i>
                        View
                      </button>
                    </Link>
                  </Stack>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>

    </>
  );
};

export default Orders;
