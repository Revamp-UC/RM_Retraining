import type { CustomerGender } from '@/types/consultation';

const maleNames = [
  'Rahul', 'Amit', 'Rakesh', 'Vikas', 'Suresh', 'Deepak', 'Rajesh',
  'Sanjay', 'Anil', 'Manoj', 'Vikram', 'Arjun', 'Nikhil', 'Rohan',
  'Gaurav', 'Harsh', 'Pranav', 'Yash', 'Kunal', 'Mohit',
];

const femaleNames = [
  'Priya', 'Neha', 'Sunita', 'Anjali', 'Pooja', 'Kavita', 'Rekha',
  'Shruti', 'Meena', 'Anita', 'Divya', 'Ritu', 'Swati', 'Nisha',
  'Preeti', 'Geeta', 'Sapna', 'Reena', 'Komal', 'Shweta',
];

export interface GeneratedCustomer {
  name: string;
  gender: CustomerGender;
}

export function generateCustomer(): GeneratedCustomer {
  const useMale = Math.random() > 0.5;
  if (useMale) {
    const name = maleNames[Math.floor(Math.random() * maleNames.length)];
    return { name, gender: 'male' };
  } else {
    const name = femaleNames[Math.floor(Math.random() * femaleNames.length)];
    return { name, gender: 'female' };
  }
}
