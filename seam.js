import { Seam } from "seam";
const seam = new Seam(process.env.SEAM_API_KEY); // SEAM_API_KEY environment variable picked up here.

// Retrieve all authorized locks and select the first lock.
const [someLock] = await seam.locks.list();

// // Inspect this device to see which capabilities it supports.
console.log(someLock.capabilities_supported);
/*
  [ 'access_code', 'lock' ]
*/

// This device supports the 'lock' capability, so you can use the Seam API to
// unlock the lock if it is locked or to lock it if it is unlocked.
if (someLock.properties.locked) {
  await seam.locks.unlockDoor({ device_id: someLock.device_id });
  console.log("unlocked");
} else {
  await seam.locks.lockDoor({ device_id: someLock.device_id });
  console.log("locked");
}
