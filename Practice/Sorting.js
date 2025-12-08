// const nums = [7, 4, 1, 5, 3];

// console.log("before swap------", nums);

//SELECTION SORT
// for (let i = 0; i <= nums.length - 2; i++) {
//   let minIndex = i;
//   console.log(nums[i]);

//   for (let j = i; j <= nums.length - 1; j++) {
//     if (nums[j] <= nums[minIndex]) {
//       minIndex = j;
//     }
//   }

//   //swap
//   let temp = nums[i];
//   nums[i] = nums[minIndex];
//   nums[minIndex] = temp;
// }

//BUBBLE SORT
// for (let i = 0; i < nums.length; i++) {
//   for (let j = 0; j < nums.length - i; j++) {
//     if (nums[j] >= nums[j + 1]) {
//       let temp = nums[j];
//       nums[j] = nums[j + 1];
//       nums[j + 1] = temp;
//     }
//   }
//   console.log("in the loop-----",nums);
// }

//INSERTION SORT

// for (let i = 0; i < nums.length; i++) {
//   let j = i;
//   while (j > 0 && nums[j - 1] >= nums[j]) {
//     let temp = nums[j];
//     nums[j] = nums[j - 1];
//     nums[j - 1] = temp;
//     j--;
//   }
// }

// console.log(nums);



//Binary search
const arr = [1, 2, 3, 4, 5, 6];

const target = 50;
let start = 0;
let end = arr.length - 1;
let found=-1
while (start <= end) {
  mid = Math.floor((start + end) / 2);
  if (target > arr[mid]) {
    start = mid + 1;
  } else if (target < arr[mid]) {
    end = mid - 1;
  } else if (target == arr[mid]) {
    found=mid
    break;
  }
}
console.log("At index---",found);
//to avoid overflow
// start+(end-start)/2
// O(log N)


