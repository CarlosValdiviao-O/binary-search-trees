const Tree = (arr) => {
    let root;
    let queue = [];
    function buildTree(arr, start = 0, end = arr.length - 1) {
        if (start > end)
            return null;
        let mid = Math.floor((start + end) / 2);
        const node = TreeNode(arr[mid]);
        node.left = buildTree(arr, start, mid - 1);
        node.right = buildTree(arr, mid + 1, end);
        return node;
    }

    function startTree() {
        arr.sort(function(a, b) {
            return a - b;
        });
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] === arr[i-1]) {
                arr.splice(i, 1);
                i--;
            }
        }
        root = buildTree(arr);
        prettyPrint(root);
    }

    const prettyPrint = (node, prefix = '', isLeft = true) => {
        if (node.right !== null) {
          prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
        }
        console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.value}`);
        if (node.left !== null) {
          prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
        }
    }

    const insert = (val, current = root) => {
        if (root === null) {
            root = TreeNode(val);
            return;
        }
        if (val > current.value) {
            if (current.right === null){
                current.right = TreeNode(val);
                prettyPrint(root);
            }
            else
                insert(val, current.right);
        }
        else {
            if (current.left === null) {
                current.left = TreeNode(val);
                prettyPrint(root);
            }
            else
                insert(val, current.left);
        }
    }

    const deleteNode = (val, current = root, prev = null) => {
        if (current === null)
            return
        if (val === current.value) {
            console.log(current);
            let dir;
            if (prev === null)
                dir = '';
            else 
                dir = (prev.left !== null && prev.left.value === val) ? 'left' : 'right';
            if (current.right === null && current.left === null) 
                (dir === '') ? root = null : prev[dir] = null;
            else if (current.left !== null && current.right === null) {
                (dir === '') ? root = current.left : prev[dir] = current.left;
            }
            else if (current.left === null && current.right !== null) {
                (dir === '') ? root = current.right : prev[dir] = current.right;
            }
            else {
                let replacement = min(current.right);
                deleteNode(replacement.value, current.right, current);
                replacement.left = current.left;
                replacement.right = current.right;
                (dir === '') ? root = replacement : prev[dir] = replacement;
            }   
            prettyPrint(root);           
        }
        else {
            if (val > current.value)
                deleteNode(val, current.right, current)
            else
                deleteNode(val, current.left, current)
        }
    }

    const min = (node) => {
        if (node.left) {
            return min(node.left);
        }
        else 
            return node;
    }

    const find = (val, current = root) => {
        if (current === null)
            return null;
        if (current.value === val) 
            return current;
        if (current.value > val)
            return find(val, current.left);
        else
            return find(val, current.right);
    }

    const levelOrder = (funct) => {
        if (root !== null) {
            queue.push(root);
        }
        let arr;
        while (queue.length > 0) {
            if (funct !== undefined)
                funct(queue[0]);
            else 
                arr.push(queue[0].value);
            if (queue[0].left !== null)
                queue.push(queue[0].left);
            if (queue[0].right !== null)
                queue.push(queue[0].right);
            queue.shift()
        }
        if (funct === undefined)
            return arr;
    } 

    const inOrder = (funct, current = root, arr = []) => {
        if (current === null)
            return arr;
        let newArr = [];
        newArr = newArr.concat(inOrder(funct, current.left, arr));
        newArr = newArr.concat([current.value]);
        if (funct !== undefined)
            funct(current);
        newArr = newArr.concat(inOrder(funct, current.right, arr));
        if (funct === undefined)
            return newArr;
    }

    const preOrder = (funct, current = root, arr = []) => {
        if (current === null)
            return arr;
        let newArr = [];
        newArr = newArr.concat([current.value]);
        if (funct !== undefined)
            funct(current)
        newArr = newArr.concat(preOrder(funct, current.left, arr));
        newArr = newArr.concat(preOrder(funct, current.right, arr));
        if (funct === undefined)
            return newArr;
    }

    const postOrder = (funct, current = root, arr = []) => {
        if (current === null)
            return arr;
        let newArr = [];
        newArr = newArr.concat(postOrder(funct, current.left, arr));
        newArr = newArr.concat(postOrder(funct, current.right, arr));
        newArr = newArr.concat([current.value]);
        if (funct !== undefined)
            funct(current);
        if (funct === undefined)
            return newArr;
    }

    const height = (val, count = -1, current) => {
        if (current === undefined)
            current = find(val);
        if (current !== null) {
            let right = height(val, count +1, current.right)
            let left = height(val, count +1, current.left)
            if (right > left)
                return right;
            else
                return left; 
        }
        else
            return count;
    }

    const depth = (val, count = 0, current = root) => {
        if (current === null)
            return -1;
        if (current.value === val)
            return count;
        let right = depth(val, count +1, current.right);
        let left = depth(val, count +1, current.left);
        if (right > left)
            return right;
        else
            return left
    }

    const isBalanced = (current = root) => {
        if (current === null)
            return true;
        let right = isBalanced(current.right);
        let left = isBalanced(current.left);
        if (right && left) {
            let rHeigth = (current.right === null) ? 0 : height(0, 0, current.right);
            let lHeigth = (current.left === null) ? 0 : height(0, 0, current.left);
            return (rHeigth - lHeigth >= -1 && rHeigth - lHeigth <= 1)
        }
        else return false
    }

    const rebalance = () => {
        let arr = inOrder();
        root = buildTree(arr);
        prettyPrint(root);
    }

    startTree();

    return { insert, deleteNode, find, levelOrder, inOrder, preOrder,
            postOrder, height, depth, isBalanced, rebalance}
}

const TreeNode = (val) => {
    let value = val;
    let left = null;
    let right = null;

    return { value, left, right }
}

const runTest = () => {
    let arr = [];
    for (let i = 0; i < 10; i++) {
        arr.push(Math.floor(Math.random() *1000));
    }
    let testTree = Tree(arr);
    console.log(`Is Balanced? ${testTree.isBalanced()}`);
    console.log('Level Order:');
    testTree.levelOrder((node) => console.log(node.value));
    console.log('Pre Order:');
    testTree.preOrder((node) => console.log(node.value));
    console.log('Post Order:');
    testTree.postOrder((node) => console.log(node.value));
    console.log('In Order:');
    testTree.inOrder((node) => console.log(node.value));
    let extras = [];
    for (let i = 0; i < 6; i++) {
        extras.push(100 + Math.floor(Math.random() * 1000));
    }
    console.log(`Add this array of numbers to the tree`);
    console.log(extras);
    for(let i = 0; i < extras.length; i++) {
        console.log(`Inserting: ${extras[i]}`);
        testTree.insert(extras[i]);
    }
    console.log(`Is Balanced? ${testTree.isBalanced()}`);
    console.log('Rebalance');
    testTree.rebalance();
    console.log(`Is Balanced? ${testTree.isBalanced()}`);
    console.log('Level Order:');
    testTree.levelOrder((node) => console.log(node.value));
    console.log('Pre Order:');
    testTree.preOrder((node) => console.log(node.value));
    console.log('Post Order:');
    testTree.postOrder((node) => console.log(node.value));
    console.log('In Order:');
    testTree.inOrder((node) => console.log(node.value));
}