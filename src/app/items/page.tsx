'use client';

import { useEffect, useState } from 'react';
import Layout from "@/components/Layout";
import Image from 'next/image';
import { ASSET_URL } from '@/utils/constants';
import ItemCard from './components/ItemCard';


export default function Items() {
  const [data, setData] = useState<ICharacter[] | null>(null);
  useEffect(() => {
    // Fetch JSON data from the public folder
    fetch('/data/items.json')
      .then((response) => response.json())
      .then((jsonData) => {
        console.log("data", jsonData);
        return setData(jsonData);
      })
      .catch((error) => console.error('Error loading JSON:', error));
  }, []);
  
  const SimpleList = ({ data, itemCount }) => {
    if (!data) {
      return (<div>Loading...</div>);
    }
    const slicedData = data.slice(0, itemCount);
    console.log("Data", slicedData);
    return (
      <div className="flex flex-row flex-wrap space-x-4">
        {slicedData.map((item, key) => (
          <ItemCard key={key} item={item} />
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <SimpleList data={data} itemCount={5} />
    </Layout>
  );
}