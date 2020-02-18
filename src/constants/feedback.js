// eslint-disable-next-line import/no-extraneous-dependencies
import { Random } from 'mockjs';
import user from './user';
//
const TBBMs = [
  'Y18103220192N10',
  'Y18103220073N01',
  'Y18103220204N02',
  'Y18103220204N03',
  'Y18103220073N04',
  'Y18103220193N05',
  'Y18103220193N06',
  'Y18103220193N07',
  'Y18103220193N08',
  'Y18103220192N09',
  'Y18103220192N10',
  'Y18103220192N11',
  'Y18103220132N12',
  'Y18103220133N13',
  'Y18103220132N14',
  'Y18103231073N01',
  'Y18103231071N02',
  'Y18103231072N03',
  'Y18103231073N04',
  'Y18103231073N05',
  'Y18103231073N06',
  'Y18103231072N07',
  'Y18103220204N19',
];

export const feedback = () => ({
  id: Random.guid(),
  TBBM: Random.pick(TBBMs),
  content: Random.cparagraph(),
  isIllegal: Random.boolean(),
  selectedImages: [
    {
      id: 'B84E8479-475C-4727-A4A4-B77AA9980897/L0/001',
      filename: 'IMG_0002.JPG',
      localUri:
        'file:///Users/Ace/Library/Developer/CoreSimulator/Devices/1C32C990-EF2C-4212-BE5C-547F8BC2816D/data/Media/DCIM/100APPLE/IMG_0002.JPG',
      mediaType: 'photo',
    },
  ],
  executor: user(),
  originator: user(),
});

export default [...Random.string(40, 80)].map(() => feedback());
