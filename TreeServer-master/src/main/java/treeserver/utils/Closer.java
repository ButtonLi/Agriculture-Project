package treeserver.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.Closeable;
import java.io.IOException;

/**
 * Created by Xin_Li on 2017/10/15.
 */
public class Closer {
    private static final Logger logger = LoggerFactory.getLogger(Closer.class);

    public static void close(Closeable closeable) {
        if (closeable != null) {
            try {
                closeable.close();
            } catch (IOException e) {
                logger.error("closer error", e);
            }
        }
    }
}
