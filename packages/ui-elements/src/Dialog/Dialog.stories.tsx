import React from 'react';
import { Button } from '../Button';
import { Dialog } from './Dialog';
import { DialogContent } from './DialogContent';
import { DialogDescription } from './DialogDescription';
import { DialogTitle } from './DialogTitle';
import { DialogTrigger } from './DialogTrigger';

export default {
  title: 'ui/Dialog',
  component: Dialog,
};

export const Small: React.FC = () => (
  <Dialog>
    <DialogTrigger>
      <Button>Open</Button>
    </DialogTrigger>
    <DialogContent width="sm">
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In non neque in
        eros pellentesque porttitor. Sed ac tincidunt elit. Nulla ullamcorper
        tincidunt orci tincidunt dictum. Maecenas varius dui sed eros
        pellentesque porta. Aliquam nulla lacus, mollis eu tincidunt et,
        ultricies et orci. Ut fringilla malesuada eros, non pharetra lorem
        congue eget. Suspendisse pellentesque gravida lectus. Donec in lacus
        posuere, dignissim turpis vel, lacinia velit. Phasellus varius sodales
        lacus, vel volutpat orci accumsan sit amet. Ut molestie diam vitae sem
        ultricies, ut condimentum nulla fermentum. Praesent lobortis pulvinar
        ipsum a maximus. Curabitur sollicitudin lacus diam, ut fringilla purus
        porttitor vitae. Cras eu leo non massa consequat molestie a eget turpis.
        Cras consequat eros sem, non maximus ipsum vehicula vitae. Mauris vel
        tincidunt odio. Mauris interdum ipsum sem, ut pulvinar erat eleifend
        porta. Nam pretium metus nisl, interdum maximus quam placerat nec. Donec
        vel augue a tortor congue malesuada. Donec nisl dolor, porttitor eget
        vulputate aliquam, tempor ut justo. Nam ullamcorper odio ipsum, vitae
        laoreet tortor porta in. Vestibulum nec efficitur felis, dapibus
        consequat elit. Suspendisse potenti. In hac habitasse platea dictumst.
        Suspendisse ac magna aliquam elit dictum semper et ut sem. In quis nisl
        nec mauris bibendum fermentum. Cras mattis pellentesque eros, id
        elementum velit varius id. Cras in dignissim nibh, vitae finibus felis.
        Aliquam ante sem, sollicitudin in commodo id, euismod ac mi. Proin
        varius sagittis justo ac faucibus. In blandit arcu a metus ornare
        tempor. Vivamus nibh dolor, pulvinar eu varius eget, malesuada eu mi.
        Quisque et eros nibh. Nullam risus neque, sagittis at dolor sit amet,
        aliquam auctor lacus. Aliquam molestie pharetra nisi, feugiat elementum
        mi tristique sed. Phasellus ligula velit, blandit in metus vitae,
        sodales accumsan nunc. Nam ex orci, facilisis quis justo sed, tristique
        pulvinar mi. Donec lacinia imperdiet tristique. Praesent mattis
        tristique ante, ut ultrices eros scelerisque sit amet. Vivamus id
        hendrerit libero, id porttitor dolor. Donec eget dui efficitur, bibendum
        nulla ac, tincidunt nulla. Maecenas ac arcu convallis, cursus ante et,
        ornare felis. Phasellus et fermentum erat, lacinia condimentum tortor.
        Sed et varius mi. Pellentesque sem neque, dignissim in tellus eu,
        molestie tincidunt nisl. Proin ornare arcu eget enim sagittis suscipit
        id eu nisi. Mauris laoreet, orci bibendum porttitor malesuada, quam
        tortor maximus lorem, ac tincidunt arcu justo nec erat. In vitae
        lobortis quam. Cras ultrices nulla nisl, id porttitor leo varius sit
        amet. Nam quam nisl, porta vitae luctus quis, consequat ut erat. Etiam
        faucibus leo eget dolor gravida vestibulum. Donec pulvinar interdum
        libero eget vulputate. Sed non leo ex. Interdum et malesuada fames ac
        ante ipsum primis in faucibus. Aliquam diam mauris, sodales non mauris
        ut, maximus rutrum massa. Fusce dictum odio a massa molestie, nec cursus
        nisi posuere. Cras nec tortor accumsan, vulputate risus interdum,
        tincidunt velit. Cras finibus sapien ut semper laoreet. Maecenas
        dignissim magna vitae mi venenatis, fringilla rhoncus neque mollis.
        Proin ac fermentum nibh, et hendrerit libero.
      </DialogDescription>
    </DialogContent>
  </Dialog>
);

export const Medium: React.FC = () => (
  <Dialog>
    <DialogTrigger>
      <Button>Open</Button>
    </DialogTrigger>
    <DialogContent width="md">
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In non neque in
        eros pellentesque porttitor. Sed ac tincidunt elit. Nulla ullamcorper
        tincidunt orci tincidunt dictum. Maecenas varius dui sed eros
        pellentesque porta. Aliquam nulla lacus, mollis eu tincidunt et,
        ultricies et orci. Ut fringilla malesuada eros, non pharetra lorem
        congue eget. Suspendisse pellentesque gravida lectus. Donec in lacus
        posuere, dignissim turpis vel, lacinia velit. Phasellus varius sodales
        lacus, vel volutpat orci accumsan sit amet. Ut molestie diam vitae sem
        ultricies, ut condimentum nulla fermentum. Praesent lobortis pulvinar
        ipsum a maximus. Curabitur sollicitudin lacus diam, ut fringilla purus
        porttitor vitae. Cras eu leo non massa consequat molestie a eget turpis.
        Cras consequat eros sem, non maximus ipsum vehicula vitae. Mauris vel
        tincidunt odio. Mauris interdum ipsum sem, ut pulvinar erat eleifend
        porta. Nam pretium metus nisl, interdum maximus quam placerat nec. Donec
        vel augue a tortor congue malesuada. Donec nisl dolor, porttitor eget
        vulputate aliquam, tempor ut justo. Nam ullamcorper odio ipsum, vitae
        laoreet tortor porta in. Vestibulum nec efficitur felis, dapibus
        consequat elit. Suspendisse potenti. In hac habitasse platea dictumst.
        Suspendisse ac magna aliquam elit dictum semper et ut sem. In quis nisl
        nec mauris bibendum fermentum. Cras mattis pellentesque eros, id
        elementum velit varius id. Cras in dignissim nibh, vitae finibus felis.
        Aliquam ante sem, sollicitudin in commodo id, euismod ac mi. Proin
        varius sagittis justo ac faucibus. In blandit arcu a metus ornare
        tempor. Vivamus nibh dolor, pulvinar eu varius eget, malesuada eu mi.
        Quisque et eros nibh. Nullam risus neque, sagittis at dolor sit amet,
        aliquam auctor lacus. Aliquam molestie pharetra nisi, feugiat elementum
        mi tristique sed. Phasellus ligula velit, blandit in metus vitae,
        sodales accumsan nunc. Nam ex orci, facilisis quis justo sed, tristique
        pulvinar mi. Donec lacinia imperdiet tristique. Praesent mattis
        tristique ante, ut ultrices eros scelerisque sit amet. Vivamus id
        hendrerit libero, id porttitor dolor. Donec eget dui efficitur, bibendum
        nulla ac, tincidunt nulla. Maecenas ac arcu convallis, cursus ante et,
        ornare felis. Phasellus et fermentum erat, lacinia condimentum tortor.
        Sed et varius mi. Pellentesque sem neque, dignissim in tellus eu,
        molestie tincidunt nisl. Proin ornare arcu eget enim sagittis suscipit
        id eu nisi. Mauris laoreet, orci bibendum porttitor malesuada, quam
        tortor maximus lorem, ac tincidunt arcu justo nec erat. In vitae
        lobortis quam. Cras ultrices nulla nisl, id porttitor leo varius sit
        amet. Nam quam nisl, porta vitae luctus quis, consequat ut erat. Etiam
        faucibus leo eget dolor gravida vestibulum. Donec pulvinar interdum
        libero eget vulputate. Sed non leo ex. Interdum et malesuada fames ac
        ante ipsum primis in faucibus. Aliquam diam mauris, sodales non mauris
        ut, maximus rutrum massa. Fusce dictum odio a massa molestie, nec cursus
        nisi posuere. Cras nec tortor accumsan, vulputate risus interdum,
        tincidunt velit. Cras finibus sapien ut semper laoreet. Maecenas
        dignissim magna vitae mi venenatis, fringilla rhoncus neque mollis.
        Proin ac fermentum nibh, et hendrerit libero.
      </DialogDescription>
    </DialogContent>
  </Dialog>
);

export const Large: React.FC = () => (
  <Dialog>
    <DialogTrigger>
      <Button>Open</Button>
    </DialogTrigger>
    <DialogContent width="lg">
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In non neque in
        eros pellentesque porttitor. Sed ac tincidunt elit. Nulla ullamcorper
        tincidunt orci tincidunt dictum. Maecenas varius dui sed eros
        pellentesque porta. Aliquam nulla lacus, mollis eu tincidunt et,
        ultricies et orci. Ut fringilla malesuada eros, non pharetra lorem
        congue eget. Suspendisse pellentesque gravida lectus. Donec in lacus
        posuere, dignissim turpis vel, lacinia velit. Phasellus varius sodales
        lacus, vel volutpat orci accumsan sit amet. Ut molestie diam vitae sem
        ultricies, ut condimentum nulla fermentum. Praesent lobortis pulvinar
        ipsum a maximus. Curabitur sollicitudin lacus diam, ut fringilla purus
        porttitor vitae. Cras eu leo non massa consequat molestie a eget turpis.
        Cras consequat eros sem, non maximus ipsum vehicula vitae. Mauris vel
        tincidunt odio. Mauris interdum ipsum sem, ut pulvinar erat eleifend
        porta. Nam pretium metus nisl, interdum maximus quam placerat nec. Donec
        vel augue a tortor congue malesuada. Donec nisl dolor, porttitor eget
        vulputate aliquam, tempor ut justo. Nam ullamcorper odio ipsum, vitae
        laoreet tortor porta in. Vestibulum nec efficitur felis, dapibus
        consequat elit. Suspendisse potenti. In hac habitasse platea dictumst.
        Suspendisse ac magna aliquam elit dictum semper et ut sem. In quis nisl
        nec mauris bibendum fermentum. Cras mattis pellentesque eros, id
        elementum velit varius id. Cras in dignissim nibh, vitae finibus felis.
        Aliquam ante sem, sollicitudin in commodo id, euismod ac mi. Proin
        varius sagittis justo ac faucibus. In blandit arcu a metus ornare
        tempor. Vivamus nibh dolor, pulvinar eu varius eget, malesuada eu mi.
        Quisque et eros nibh. Nullam risus neque, sagittis at dolor sit amet,
        aliquam auctor lacus. Aliquam molestie pharetra nisi, feugiat elementum
        mi tristique sed. Phasellus ligula velit, blandit in metus vitae,
        sodales accumsan nunc. Nam ex orci, facilisis quis justo sed, tristique
        pulvinar mi. Donec lacinia imperdiet tristique. Praesent mattis
        tristique ante, ut ultrices eros scelerisque sit amet. Vivamus id
        hendrerit libero, id porttitor dolor. Donec eget dui efficitur, bibendum
        nulla ac, tincidunt nulla. Maecenas ac arcu convallis, cursus ante et,
        ornare felis. Phasellus et fermentum erat, lacinia condimentum tortor.
        Sed et varius mi. Pellentesque sem neque, dignissim in tellus eu,
        molestie tincidunt nisl. Proin ornare arcu eget enim sagittis suscipit
        id eu nisi. Mauris laoreet, orci bibendum porttitor malesuada, quam
        tortor maximus lorem, ac tincidunt arcu justo nec erat. In vitae
        lobortis quam. Cras ultrices nulla nisl, id porttitor leo varius sit
        amet. Nam quam nisl, porta vitae luctus quis, consequat ut erat. Etiam
        faucibus leo eget dolor gravida vestibulum. Donec pulvinar interdum
        libero eget vulputate. Sed non leo ex. Interdum et malesuada fames ac
        ante ipsum primis in faucibus. Aliquam diam mauris, sodales non mauris
        ut, maximus rutrum massa. Fusce dictum odio a massa molestie, nec cursus
        nisi posuere. Cras nec tortor accumsan, vulputate risus interdum,
        tincidunt velit. Cras finibus sapien ut semper laoreet. Maecenas
        dignissim magna vitae mi venenatis, fringilla rhoncus neque mollis.
        Proin ac fermentum nibh, et hendrerit libero.
      </DialogDescription>
    </DialogContent>
  </Dialog>
);
