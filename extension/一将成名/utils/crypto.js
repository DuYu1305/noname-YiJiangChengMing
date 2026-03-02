// 关键信息 - 不希望被修改的内容
const AUTHOR = "我的名字";
const ANNOUNCEMENT = "这是公告内容，不允许修改";

// 计算字符串的SHA-256哈希值
function calculateHash(str) {
    // 创建一个文本编码器
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    
    // 使用Web Crypto API计算SHA-256哈希
    return crypto.subtle.digest('SHA-256', data)
        .then(hash => {
            // 将哈希转换为十六进制字符串
            return Array.from(new Uint8Array(hash))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
        });
}

// 预先计算好的哈希值 - 发布前计算一次并硬编码
const ORIGINAL_HASH = "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8c9d0e1f2a3b4c5d6e7f8a9b0c1d2"; // 示例值，实际使用时需要重新计算

// 检查关键信息是否被修改
async function checkIntegrity() {
    // 组合所有关键信息
    const combined = `${AUTHOR}|${ANNOUNCEMENT}`;
    // 计算当前哈希值
    const currentHash = await calculateHash(combined);
    // 对比哈希值
    return currentHash === ORIGINAL_HASH;
}

// 程序主入口
async function main() {
    // 首先检查完整性
    const isIntact = await checkIntegrity();
    
    if (!isIntact) {
        console.error("关键信息已被修改，程序无法运行！");
        // 终止程序执行
        return;
    }
    
    // 关键信息未被修改，继续执行程序
    console.log("程序正常启动");
    console.log(`作者: ${AUTHOR}`);
    console.log(`公告: ${ANNOUNCEMENT}`);
    
    // 这里放置你的程序主要逻辑
}

// 启动程序
main();
    