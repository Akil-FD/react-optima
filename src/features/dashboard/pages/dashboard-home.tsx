import type { Property } from "../../../api/types";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import Dropdown from "../../../components/ui/Dropdown/Dropdown";
import { InfiniteScroll } from "../../../components/ui/VirtualizedInfiniteList/VirtualizedInfiniteList";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchUsers } from "../../../store/users/users.thunk";
import React, { useCallback, useEffect, useMemo } from "react";

export default function DashboardHome() {
  const propertyTypes = [
    "Apartment",
    "Villa",
    "Townhouse",
    "Hotel",
    "Duplex",
    "Compound",
  ];

  const rentTypes = [
    "Rent",
    "Sale",
    "Buy",
    "Apartment",
  ];

  const categoryTypes = [
    "Commerical",
    "Residential",
  ];


  const dispatch = useAppDispatch();

  const { items, loading, hasMore, page } = useAppSelector(
    (state) => state.users
  );

  useEffect(() => {
    document.title = "Properties | Dashboard";
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      dispatch(fetchUsers(page))
        .unwrap()
        .catch((err) => alert(err));
    }
  }, [dispatch, loading, hasMore, page]);

  const renderItem = useCallback(
    (user: Property) => (
      <InfiniteScroll.Item>
        <div style={{ padding: "20px" }}>
          <PropertyCard
            image={user.property_images?.[0] ?? ""}
            title={user.title}
            rating={user.rating ?? 0}
            reviews="Mercedes Vito"
            guests={2}
            bedrooms={user.rooms}
            bathrooms={user.formatted_bathrooms}
            type="Entire Studio Apartment"
          />
        </div>
      </InfiniteScroll.Item>
    ),
    []
  );

  return (
    <DashboardLayout>
      <div className='filter-container'>
        <h1>Stays in Los Angles</h1>
        <Dropdown
          options={rentTypes}
          defaultValue="Select Type"
          className="my-custom-select"
          onChange={(value) => console.log("Selected:", value)}
        />

        <Dropdown
          options={categoryTypes}
          defaultValue="Select Categories"
          className="my-custom-select"
          onChange={(value) => console.log("Selected:", value)}
        />
        <Dropdown
          options={propertyTypes}
          defaultValue="Select Property Type"
          className="my-custom-select"
          onChange={(value) => console.log("Selected:", value)}
        />
      </div>

      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <InfiniteScroll
          items={items}
          hasMore={hasMore}
          loading={loading}
          loadMore={loadMore}
          initialLoad={true}
        >
          <InfiniteScroll.List itemHeight={300}>
            {renderItem}
          </InfiniteScroll.List>

          <InfiniteScroll.Loader />
        </InfiniteScroll>
      </div>
    </DashboardLayout>
  );
}

interface PropertyCardProps {
  image: string;
  title: string;
  rating: number;
  reviews?: string;
  guests: number;
  bedrooms: string;
  bathrooms: string;
  type: string;
}

const PropertyCardComponent: React.FC<PropertyCardProps> = ({
  image,
  title,
  rating,
  reviews,
  guests,
  bedrooms,
  bathrooms,
  type,
}) => {
  const ratingStars = useMemo(() => {
    if (!rating) return null;

    return Array.from({ length: Math.floor(rating) }).map((_, index) => (
      <span key={index}>⭐</span>
    ));
  }, [rating]);

  const details = useMemo(() => {
    return `${guests} guests | ${bedrooms} bedroom | ${bathrooms.toLowerCase()}`;
  }, [guests, bedrooms, bathrooms]);

  return (
    <div className="property-card">
      <div className="card-image">
        <img src={image} alt={title} loading="lazy" />
      </div>

      <div className="card-content">
        <h3 className="title">{title}</h3>

        <div className="rating">
          {rating ? (
            <>
              {ratingStars}
              <span> {rating}</span>
            </>
          ) : (
            <span>No rating</span>
          )}

          {reviews && <span className="reviews"> | {reviews}</span>}
        </div>

        <p className="details">{details}</p>

        <div className="type">🏢 {type}</div>
      </div>
    </div>
  );
};

const PropertyCard = React.memo(PropertyCardComponent);